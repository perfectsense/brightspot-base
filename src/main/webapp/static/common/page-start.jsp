<%@include file="/render/common/taglibs.jsp" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="title" content="">
    <meta name="description" content=""/>

    <title>Brightspot Base</title>

    <c:choose>
      <c:when test="${param.useLess}">
        <link rel="stylesheet/less" type="text/css" href="/assets/styles/main.less" />
        <script src="/assets/scripts/less.js"></script>
      </c:when>

      <c:otherwise>
        <link rel="stylesheet" type="text/css" href="/assets/styles/main.min.css" />
      </c:otherwise>
    </c:choose>

    <!-- minified version -->
    <!-- <script src="/assets/scripts.min/main.js"></script> -->

    <script src="/assets/scripts/system.js"></script>
    <script src="/assets/scripts/config.js"></script>
    <script>
      System.config({
        map: {
          babel: '/assets/scripts/browser.min.js',
          baseURL: '/assets/scripts'
        }
      });
      System.import('/assets/scripts/main');
    </script>

  </head>
  <body class="${bodyClass}">