import React, {createContext, useReducer} from 'react';
import { fromJS } from 'immutable';

//context
export const CategoryDataContext = createContext ({});

// 相当于之前的 constants
export const CHANGE_AREAS = 'singers/CHANGE_AREAS';
export const CHANGE_TYPES = 'singers/CHANGE_TYPES';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

//reducer 纯函数
const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_TYPES:
            return state.set ('types', action.data);
        case CHANGE_AREAS:
            return state.set ('areas', action.data);
        case CHANGE_ALPHA:
            return state.set ('alpha', action.data);
        default:
            return state;
    }
};

//Provider 组件
export const Data = props => {
    //useReducer 的第二个参数中传入初始值
    const [data, dispatch] = useReducer (reducer, fromJS ({
        types:'',
        areas:'',
        alpha: ''
    }));
    return (
        <CategoryDataContext.Provider value={{data, dispatch}}>
            {props.children}
        </CategoryDataContext.Provider>
    )
}