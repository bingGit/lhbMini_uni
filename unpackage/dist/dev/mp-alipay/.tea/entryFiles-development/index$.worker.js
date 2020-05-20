if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../component/easyModal/base/baseModal?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../component/easyModal/auth/auth?hash=296245be13976f2e29515f0f7d7db13b8ef25c67');
require('../../component/nav-bar/nav-bar?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../component/canvasdrawer/canvasdrawer?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../component/component_circle/circle/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../component/easyModal/easy/easyModal?hash=296245be13976f2e29515f0f7d7db13b8ef25c67');
require('../../component/easyModal/custom-modal/custom-modal?hash=296245be13976f2e29515f0f7d7db13b8ef25c67');
require('../../component/modals/modals?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../pages/ablum/ablum?hash=2ccaad4a315aee80a36b7b0cb44e42261f419dcf');
require('../../pages/login/changePhone?hash=d7fd655ac799565adbae55e45607da7b3eb423f5');
require('../../pages/wtest/result?hash=05dc5c191160c793ccacc7401ecbcf6d74dcfa44');
require('../../pages/wtest/wtest?hash=d7fd655ac799565adbae55e45607da7b3eb423f5');
require('../../pages/wtest/rank?hash=d7fd655ac799565adbae55e45607da7b3eb423f5');
require('../../pages/login/login?hash=d7fd655ac799565adbae55e45607da7b3eb423f5');
require('../../pages/login/bindingPhone?hash=d7fd655ac799565adbae55e45607da7b3eb423f5');
require('../../pages/webview/award?hash=33405d49eea1329785672922bf870b385835b6ee');
require('../../pages/my/my?hash=cd75debb1c875bb5fa1534ea047eec813b0edb61');
require('../../pages/wtest/result_list?hash=d7fd655ac799565adbae55e45607da7b3eb423f5');
require('../../pages/ablum/ablum-content?hash=6608b1349ddd654cb466f593740d31ecfec468a1');
require('../../pages/ablum/ablum-detail?hash=53b2a52a06764a54cf1de64154db42ff37aa3bad');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}