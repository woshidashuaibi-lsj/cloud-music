import React, {useEffect, useContext} from 'react';
import Horizen from '../../baseUI/horizenItem';
import { alphaTypes,type,area } from '../../api/config';
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
import {CategoryDataContext, CHANGE_ALPHA, CHANGE_AREAS, CHANGE_TYPES} from "./data";
import {renderRoutes} from "react-router-config";

function Singers(props) {
  // let [category, setCategory] = useState('');
  // let [alpha, setAlpha] = useState('');
  // const [types, setTypes] = useState('');
  // const [areas, setAreas] = useState('')

  // 首先需要引入 useContext
// 将之前的 useState 代码删除
  const {data, dispatch} = useContext (CategoryDataContext);
// 拿到 category 和 alpha 的值
  const {types,areas,alpha} = data.toJS ();

  const { songsCount } = props;

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props;

  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  useEffect(() => {
    if (!singerList.size) {
      getHotSingerDispatch();
      // eslint-disable-next-line
    }
  }, []);

  //CHANGE_ALPHA 和 CHANGE_CATEGORY 变量需要从 data.js 中引入
  let handleUpdateAlpha = (val) => {
    dispatch ({type: CHANGE_ALPHA, data: val});
    updateDispatch(types,areas, val);
  };

  let handleUpdateType = (val) => {
    console.log(val)
    dispatch ({type: CHANGE_TYPES, data: val});
    updateDispatch(val, areas, alpha);
  }
  const handleUpdateArea = (val) => {
    console.log(val)
    dispatch ({type: CHANGE_AREAS, data: val});
    updateDispatch(types,val,alpha);
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(types, areas, alpha,types === '', areas=== '',alpha==='', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(types,areas,alpha);
  };
  const enterDetail = (id)  => {
    props.history.push (`/singers/${id}`);
  };

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS(): [];
    console.log(props)
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => enterDetail(item.id)}>
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
        <Horizen list={type} title={"歌手类型: "} handleClick={val => handleUpdateType(val)} oldVal={types}/>
        <Horizen list={area} title={"地区分类: "} handleClick={val => handleUpdateArea(val)} oldVal={areas}/>
        <Horizen list={alphaTypes} title={"首字母: "} handleClick={val => handleUpdateAlpha(val)} oldVal={alpha}/>
      </NavContainer>
      <ListContainer play={songsCount}>
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
      { renderRoutes (props.route.routes) }
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn (['player', 'playList']).size,
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