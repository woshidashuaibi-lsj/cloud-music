//Album/index.js
import React, {useState, useCallback, useRef, useEffect} from 'react';
import {Container, TopDesc, Menu, SongItem} from './style';
import {CSSTransition} from 'react-transition-group';
import Header from './../../baseUI/header/index';
import Scroll from '../../baseUI/Scroll/index';
import {getCount, getName, isEmptyObject} from "../../api/utils";
import {HEADER_HEIGHT} from '../../api/config';
import style from "../../assets/global-style";
import {connect} from 'react-redux';
import {getAlbumList, changeEnterLoading} from './store/actionCreators';
import SongList from '../SongList'
import Loading from '../../baseUI/Loading/index';
import MusicNote from "../../baseUI/musicNote";


function Album(props) {
    // 从路由中拿到歌单的 id
    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState("歌单");
    const [isMarquee, setIsMarquee] = useState(false);//是否跑马灯

    const musicNoteRef = useRef();

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({x, y});
    };

    const headerEl = useRef();
    const { songsCount } = props;
    const {currentAlbum: currentAlbumImmutable, enterLoading} = props;
    const {getAlbumDataDispatch} = props;

    const id = props.match.params.id;

    useEffect(() => {
        getAlbumDataDispatch(id);
    }, [getAlbumDataDispatch, id]);

    let currentAlbum = currentAlbumImmutable.toJS();

    const handleBack = useCallback(() => {
        setShowStatus(false);
    }, []);

    const handleScroll = useCallback((pos) => {
        let minScrollY = -HEADER_HEIGHT;
        let percent = Math.abs(pos.y / minScrollY);
        let headerDom = headerEl.current;
        //滑过顶部的高度开始变化
        if (pos.y < minScrollY) {
            headerDom.style.backgroundColor = style["theme-color"];
            headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
            setTitle(currentAlbum.name);
            setIsMarquee(true);
        } else {
            headerDom.style.backgroundColor = "";
            headerDom.style.opacity = 1;
            setTitle("歌单");
            setIsMarquee(false);
        }
    }, [currentAlbum]);

    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbum.coverImgUrl}>
                <div className="background">
                    <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                    <div className="decorate"></div>
                    <img src={currentAlbum.coverImgUrl} alt=""/>
                    <div className="play_count">
                        <i className="iconfont play">&#xe885;</i>
                        <span className="count">{getCount(currentAlbum.subscribedCount)}</span>
                    </div>
                </div>
                <div className="desc_wrapper">
                    <div className="title">{currentAlbum.name}</div>
                    <div className="person">
                        <div className="avatar">
                            <img src={currentAlbum.creator.avatarUrl} alt=""/>
                        </div>
                        <div className="name">{currentAlbum.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        )
    }

    const renderMenu = () => {
        return (
            <Menu>
                <div>
                    <i className="iconfont">&#xe6ad;</i>
                    评论
                </div>
                <div>
                    <i className="iconfont">&#xe86f;</i>
                    点赞
                </div>
                <div>
                    <i className="iconfont">&#xe62d;</i>
                    收藏
                </div>
                <div>
                    <i className="iconfont">&#xe606;</i>
                    更多
                </div>
            </Menu>
        )
    };

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container play={songsCount}>
                <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}/>
                {!isEmptyObject(currentAlbum) ?
                    (
                        <Scroll
                            bounceTop={false}
                            onScroll={handleScroll}
                        >
                            <div>
                                {renderTopDesc()}
                                {renderMenu()}
                                {/*{ renderSongList() }*/}
                                <SongList
                                    songs={currentAlbum.tracks}
                                    collectCount={currentAlbum.subscribedCount}
                                    showCollect={true}
                                    showBackground={false}
                                    musicAnimation={musicAnimation}
                                />
                            </div>
                        </Scroll>
                    )
                    : null
                }
                {enterLoading ? <Loading/> : null}
                <MusicNote ref={musicNoteRef}/>
            </Container>
        </CSSTransition>
    )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    songsCount: state.getIn (['player', 'playList']).size,
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getAlbumDataDispatch(id) {
            dispatch(changeEnterLoading(true));
            dispatch(getAlbumList(id));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));