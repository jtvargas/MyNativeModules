//
//  MyNativeModule.swift
//  MyNativeModules
//
//  Created by J.T on 12/20/23.
//

import Foundation

/** `@objc` attribute exposes Swift methods to the Objective-C runtime**/
@objc(MyNativeModule)
class MyNativeModule: RCTEventEmitter {
  private var greetingMessage = "Hello World"
  
  /**
   `RCTResponseSenderBlock` helps to do a callback with the current value.
   
    In JavaScript, this function is used as a normal callback, appearing as `salute(value => {})`
   
   - Parameter callback: A `RCTResponseSenderBlock` that is called with the current value.
   - `sendEvent`: is been used to emit an event that is happening from the Native side using the `RCTEventEmitter`
   */
  @objc(salute:)
  func salute(_ callback: RCTResponseSenderBlock){
    callback([greetingMessage])
    sendEvent(withName: "onSalute", body: ["salute the audience", greetingMessage])
  }
  
  /**
    Asynchronously evaluates the `value` and either resolves or rejects a promise.
   
    In JavaScript, this can be handled using `async/await` within a `try/catch` (or with a `.then().catch()` ) block..
   - Parameters:
      - resolve: A `RCTPromiseResolveBlock` that resolves the promise with a modified value if the condition is met.
      - `reject`: A `RCTPromiseRejectBlock` that rejects the promise. In Javascript this function happens in the `.catch` block
   - `sendEvent`: is been used to emit an event that is happening from the Native side using the `RCTEventEmitter`
   */
  @objc(saluteAsync:rejecter:)
  func saluteAsync(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock){
    if(greetingMessage == "Hello World"){
      resolve(greetingMessage)
      sendEvent(withName: "onSaluteAsync", body: ["async salute the audience", greetingMessage])
    }else {
      let error = NSError(domain: "", code: 400, userInfo: nil)
      reject("ERROR_CODE_1", "The greetings message is invalid", error)
      sendEvent(withName: "onSaluteAsyncError", body: ["async salute error", error])
    }
  }
  
  /**
    This function overrides `supportedEvents` to define a list of custom event names.
    
    These event names are used in the JavaScript/React Native side of the application.
    The application components can listen to these events using the `.addEventListener` method.
   */
  override func supportedEvents() -> [String]! {
    return ["onSalute","onSaluteAsyncError", "onSaluteAsync"]
  }
  
  /**
     Exports constants that are available at runtime to the JavaScript side.
     This method provides an initial set of constants that can be used in JS.
   
      `Note:` if we're using `RCTEventEmmitter` class we need to `override` the `constantsToExport` method because it already exist in the `RCTEventEmmitter` class
   */
  @objc(constantsToExport)
  override func constantsToExport() -> [AnyHashable: Any]!{
    return ["name": "John", "age": 25]
  }
  
  /**
    Specifies whether this module should be initialized on the main thread.
   
    This is essential if the module interacts with UI or requires access to UIKit, as these interactions
    must occur on the main thread. It ensures that the module is fully set up and ready before any JavaScript code.
   
    `Note:` Returning `true` may have performance implications, as it can delay the React Native. JavaScript thread initialization until the module is fully set up. Use this setting only if necessary
    `Note:` if we're using `RCTEventEmmitter` class we need to `override` the `requiresMainQueueSetup` method because it already exist in the `RCTEventEmmitter` class
   */
  @objc(requiresMainQueueSetup)
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
