document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("username") && localStorage.getItem("password")) {
    document.getElementById("username").value =
      localStorage.getItem("username");
    document.getElementById("password").value =
      localStorage.getItem("password");
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
    let url;
    const mode = document.getElementById("tokenMode").value;

    switch (mode) {
      case "site-AB":
        url = "https://asanbourse.ir/Token";
        break;
      case "site-AC":
        url = "https://asancrypto.com/Token";
        break;
      case "local-AB":
        url = "https://localhost:44305/Token";
        break;
      case "local-AC":
        url = "https://localhost:44307/Token";
        break;
      default:
        url = "https://asanbourse.ir/Token";
        break;
    }

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

    const headers = {
      FingerPrint: fingerprint,
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    };

    $.ajax({
      type: "POST",
      url,
      data: userLoginInfo,
      headers: headers,
    })
      .done(function (data) {
        document.getElementById("successMessage").innerHTML =
          "DONE token fetched and placed in local storage";
        chrome.tabs.query({ active: true }, function (tabs) {
          for (const tabInd in tabs) {
            chrome.tabs.executeScript(tabs[tabInd].id, {
              code: `localStorage.setItem("accessToken", "${data.access_token}")`,
            });
          }
        });
      })
      .fail(function (ex) {
        $("#failedMessage").text(
          `Error Fetching Token: ${JSON.stringify(ex.statusCode())} ${
            ex.statusText
          }`
        );
      });
  } catch (ex) {}
};
