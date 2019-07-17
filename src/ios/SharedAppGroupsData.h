#import <Cordova/CDVPlugin.h>

@interface SharedAppGroupsData : CDVPlugin
- (void) save:(CDVInvokedUrlCommand*)command;
- (void) load:(CDVInvokedUrlCommand*)command;
@end
