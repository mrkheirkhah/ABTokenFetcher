document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("username") && localStorage.getItem("password")) {
    document.getElementById("username").value = localStorage.getItem(
      "username"
    );
    document.getElementById("password").value = localStorage.getItem(
      "password"
    );
    document.getElementById("rememberMe").checked = true;
  }
  var fetchTokenButton = document.getElementById("fetchTokenForm");
  fetchTokenButton.addEventListener("submit", fetchToken, false);
});

const fetchToken = (e) => {
  document.getElementById("failedMessage").innerHTML = "";
  document.getElementById("failedMessage").innerHTML = "";
  e.stopPropagation();
  e.preventDefault();
  try {
    var req = new XMLHttpRequest();
    var url = "https://asanbourse.ir/Token";
    req.open("POST", url, true);

    const userLoginInfo =
      "grant_type=password&" +
      "username=" +
      encodeURIComponent(document.getElementById("username").value) +
      "&password=" +
      encodeURIComponent(document.getElementById("password").value);

    const rememberMe = document.getElementById("rememberMe");

    if (rememberMe.checked) {
      localStorage.setItem(
        "username",
        document.getElementById("username").value
      );
      localStorage.setItem(
        "password",
        document.getElementById("password").value
      );
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }

    const fingerprint = new Fingerprint({
      canvas: true,
      screen_resolution: true,
    }).get();

    req.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );

    req.setRequestHeader("Access-Control-Allow-Origin", "*");

    req.setRequestHeader("FingerPrint", fingerprint);
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        document.getElementById("successMessage").innerHTML =
          req.status + "token fetched and placed in local storage";
        chrome.tabs.query({ active: true }, function (tabs) {
          chrome.tabs.executeScript(tabs[0].id, {
            code: `localStorage.setItem("accessToken", "${
              JSON.parse(req.responseText).access_token
            }")`,
          });
        });
      } else if (req.status !== 200) {
        document.getElementById("failedMessage").innerHTML =
          "some error accrued" + req.status + req.statusText;
      }
    };
    req.send(userLoginInfo);
  } catch (e) {
    document.getElementById("failedMessage").innerHTML = JSON.stringify(e);
  }
};
