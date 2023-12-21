//
//  MyNativeModule.m
//  MyNativeModules
//
//  Created by J.T on 12/20/23.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(MyNativeModule, NSObject)

RCT_EXTERN_METHOD(salute:(RCTResponseSenderBlock) callback)
RCT_EXTERN_METHOD(saluteAsync:(RCTPromiseResolveBlock) resolve rejecter:(RCTPromiseRejectBlock) reject)

@end
