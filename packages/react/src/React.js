/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactVersion from 'shared/ReactVersion';
import {
  REACT_FRAGMENT_TYPE,
  REACT_PROFILER_TYPE,
  REACT_STRICT_MODE_TYPE,
  REACT_SUSPENSE_TYPE,
  REACT_SUSPENSE_LIST_TYPE,
} from 'shared/ReactSymbols';

import {Component, PureComponent} from './ReactBaseClasses';
import {createRef} from './ReactCreateRef';
import {forEach, map, count, toArray, only} from './ReactChildren';
import {
  createElement,
  createFactory,
  cloneElement,
  isValidElement,
  jsx,
} from './ReactElement';
import {createContext} from './ReactContext';
import {lazy} from './ReactLazy';
import forwardRef from './forwardRef';
import memo from './memo';
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useResponder,
} from './ReactHooks';
import {withSuspenseConfig} from './ReactBatchConfig';
import {
  createElementWithValidation,
  createFactoryWithValidation,
  cloneElementWithValidation,
  jsxWithValidation,
  jsxWithValidationStatic,
  jsxWithValidationDynamic,
} from './ReactElementValidator';
import ReactSharedInternals from './ReactSharedInternals';
import createFundamental from 'shared/createFundamentalComponent';
import createResponder from 'shared/createEventResponder';
import createScope from 'shared/createScope';
import {
  enableJSXTransformAPI,
  enableFlareAPI,
  enableFundamentalAPI,
  enableScopeAPI,
} from 'shared/ReactFeatureFlags';

const React = {
  // 提供了一堆处理 props.children 的 API，React.Children 是一个类数组，可以用下面提供的四个方法操作 children。
  Children: {
    map,
    forEach,
    count,
    toArray,
    only,
  },

  /*
   * 新版本创建 ref 的方式，在旧版本中，可以使用 string ref 的方式定义，新版本中，只接受如下的方式定义：
   * class App extends React.Component {
   *  constructor(props){
   *    // 第一种
   *    this.ref = React.createRef();
   *  }
   *  render(){
   *    // 第一种
   *    return <div ref={this.ref} />
   *
   *    // 第二种
   *    return <div ref={item=>this.ref = item} />
   *  }
   * }
   */
  createRef,

  // Component 和 PureComponent 两者的区别：PureComponent 在原型链上增加了一个 isPureReactComponent 的标识。
  Component,
  PureComponent,

  /*
   * createContext 是新版本提供的，用于解决跨多层组件之间的通信方案，老版本提供的 context API 已经被废弃。具体使用方法如下：
   * const {Provider, Consumer} = React.createContext();
   *
   * const ParentComponent = props => (
   *    <Provider value="This is a value">
   *      {props.children}
   *    </Provider>
   * );
   *
   * const ChildComponent = props => (
   *    <Consumer>
   *      {value => <p>{value}</p>}
   *    </Consumer>
   * );
   */
  createContext,
  // 用于解决 HOC 的 ref 传递问题，使用方法：React.forwardRef((props, ref)=> <MyComponent {...props} ref={ref} />)
  forwardRef,
  lazy,
  memo,

  // 以下为常用的 hooks ，具体等后续分析
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,

  // React 内置组件，具体等后续分析
  Fragment: REACT_FRAGMENT_TYPE,
  Profiler: REACT_PROFILER_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,
  unstable_SuspenseList: REACT_SUSPENSE_LIST_TYPE,

  // React 内置方法 API，具体等后续分析，这里 __DEV__ 表示 development 环境。
  // development 环境下，走 createElementWithValidation，否则走 createElement。
  createElement: __DEV__ ? createElementWithValidation : createElement,
  cloneElement: __DEV__ ? cloneElementWithValidation : cloneElement,
  createFactory: __DEV__ ? createFactoryWithValidation : createFactory,
  isValidElement: isValidElement,

  version: ReactVersion,

  unstable_withSuspenseConfig: withSuspenseConfig,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals,
};

if (enableFlareAPI) {
  React.unstable_useResponder = useResponder;
  React.unstable_createResponder = createResponder;
}

if (enableFundamentalAPI) {
  React.unstable_createFundamental = createFundamental;
}

if (enableScopeAPI) {
  React.unstable_createScope = createScope;
}

// Note: some APIs are added with feature flags.
// Make sure that stable builds for open source
// don't modify the React object to avoid deopts.
// Also let's not expose their names in stable builds.

if (enableJSXTransformAPI) {
  if (__DEV__) {
    React.jsxDEV = jsxWithValidation;
    React.jsx = jsxWithValidationDynamic;
    React.jsxs = jsxWithValidationStatic;
  } else {
    React.jsx = jsx;
    // we may want to special case jsxs internally to take advantage of static children.
    // for now we can ship identical prod functions
    React.jsxs = jsx;
  }
}

export default React;
