import React, {useState, useEffect} from 'react';
import Horizen from '../../baseUI/horizenItem';
import { categoryTypes, alphaTypes,type,area } from '../../api/config';
import {
  NavContainer,
  ListContainer,
  List,
  ListItem,
} from "./style";
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList
} from './store/actionCreators';
import  LazyLoad, {forceCheck} from 'react-lazyload';
import Scroll from './../../baseUI/Scroll';
import {connect} from 'react-redux';
import Loading from '../../baseUI/Loading';
import {Content} from "../Recommend/style";

function Singers(props) {
  // let [category, setCategory] = useState('');
  let [alpha, setAlpha] = useState('');
  const [types, setTypes] = useState('');
  const [areas, setAreas] = useState('')

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;

  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  useEffect(() => {
    getHotSingerDispatch();
    // eslint-disable-next-line
  }, []);

  let handleUpdateAlpha = (val) => {
    setAlpha(val);
    updateDispatch(types,areas, val);
  };

  let handleUpdateType = (val) => {
    console.log(val)
    setTypes(val)
    updateDispatch(val, areas, alpha);
  }
  const handleUpdateArea = (val) => {
    console.log(val)
    setAreas(val)
    updateDispatch(types,val,alpha);
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(types, areas, alpha,types === '', areas=== '',alpha==='', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(types,areas,alpha);
  };

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS(): [];
    console.log(props)
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  return (
    <div>
      <NavContainer>
        <Horizen list={type} title={"歌手类型: "} handleClick={val => handleUpdateType(val)} oldVal={types}></Horizen>
        <Horizen list={area} title={"地区分类: "} handleClick={val => handleUpdateArea(val)} oldVal={areas}></Horizen>
        <Horizen list={alphaTypes} title={"首字母: "} handleClick={val => handleUpdateAlpha(val)} oldVal={alpha}></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={ handlePullUp }
          pullDown = { handlePullDown }
          pullUpLoading = { pullUpLoading }
          pullDownLoading = { pullDownLoading }
          onScroll={forceCheck}
        >
          { renderSingerList() }
        </Scroll>
        { enterLoading ? <Loading/> : null }
      </ListContainer>
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
});
const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
      dispatch(changeEnterLoading(false))
    },
    updateDispatch(types,areas,alpha,) {
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(false));
      dispatch(getSingerList(types,areas,alpha));
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(types,areas,alpha, hot, count) {
      console.log(1)
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count+1));
      if(hot){
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(types,areas,alpha));
      }
    },
    //顶部下拉刷新
    pullDownRefreshDispatch(types,areas,alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));
      if(alpha === '' && areas === '' && types === ''){
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(types,areas,alpha,0));
      }
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Singers);