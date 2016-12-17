exports.frontpage = function()  {
  return{
    templateUrl: 'templates/frontpage.html'
  };
};

exports.login = function()  {
  return{
    controller: 'loginController',
    templateUrl: 'templates/login.html'
  };
};