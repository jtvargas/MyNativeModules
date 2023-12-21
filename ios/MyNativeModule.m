//
//  MyNativeModule.m
//  MyNativeModules
//
//  Created by J.T on 12/20/23.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(MyNativeModule, RCTEventEmitter)

/**
  `RCT_EXTERN_METHOD` in React Native allows exposing native methods to the JavaScript bridge.
 
  It follows the syntax: `RCT_EXTERN_METHOD(methodName:(paramType)internalParamName ...)`
  
  For one argument: `RCT_EXTERN_METHOD(methodName:(ParamType)internalParamName)`
 
  For multiple arguments: `RCT_EXTERN_METHOD(methodName:(ParamType1)internalParamName1 [externalParamName2]:(ParamType2)internalParamName2 ...)`
 */
RCT_EXTERN_METHOD(salute:(RCTResponseSenderBlock) callback)
RCT_EXTERN_METHOD(saluteAsync:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject)

@end
