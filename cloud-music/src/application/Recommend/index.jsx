import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/Scroll';
import { Content } from './style';
import { forceCheck } from 'react-lazyload';
import { renderRoutes } from 'react-router-config';
import Loading from '../../baseUI/Loading';

function Recommend (props){

    const { songsCount } = props;

    const { bannerList, recommendList ,enterLoading} = props;

    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

    useEffect (() => {
        console.log(bannerList)
        if (!bannerList?.size){
            getBannerDataDispatch ();
        }
        if (!recommendList?.size) {
            getRecommendListDataDispatch ();
        }

    }, []);

    const bannerListJS = bannerList ? bannerList.toJS () : [];
    const recommendListJS = recommendList ? recommendList.toJS () :[];

    return (
        <Content play={songsCount}>
            <Scroll className="list" onScroll={forceCheck}>
                <div>
                    <Slider bannerList={bannerListJS}/>
                    <RecommendList recommendList={recommendListJS}/>
                </div>
            </Scroll>
            { enterLoading ? <Loading/> : null }
            { renderRoutes (props.route.routes) }
        </Content>
    );
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    // 不要在这里将数据 toJS
    // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
    bannerList: state.getIn (['recommend', 'bannerList']),
    recommendList: state.getIn (['recommend', 'recommendList']),
    enterLoading: state.getIn (['recommend', 'enterLoading']),
    songsCount: state.getIn (['player', 'playList']).size,// 尽量减少 toJS 操作，直接取 size 属性就代表了 list 的长度
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch () {
            dispatch (actionTypes.getBannerList ());
        },
        getRecommendListDataDispatch () {
            dispatch (actionTypes.getRecommendList ());
        },
    }
};

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Recommend);