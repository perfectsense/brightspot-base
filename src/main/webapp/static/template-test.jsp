<%@ page import="com.brightspotbase.TemplateTest" %>
<%@ page import="java.net.URL" %>
<% TemplateTest t=new TemplateTest(); %>
<% URL testDataUrl = new URL("http://" + request.getHeader("host") + "/static/data/template-test-data.json"); %>
<% String testData = t.getDataFromUrl(testDataUrl); %>
<!DOCTYPE html>
<html>
    <head>
        <title>Template test</title>
        <script src="/assets/scripts/jquery.js"></script>
        <script src="/assets/scripts/require.js" data-main="/assets/scripts/main.js"></script>
    </head>
    <body>
        <h1>Template test</h1>

        <h2>Written from server side template (inline data):</h2>

        <% out.print( t.renderTemplate("test", testData ) ); %>

        <h2>Written from server side template (remote data):</h2>
        <% out.print( t.renderTemplate("test", testDataUrl ) ); %>

        <h2>Server side component test (partial paths don't resolve relatively)</h2>
        <% out.print( t.renderTemplate("components/test", testData ) ); %>

        <h2>Written from client side template (inline data):</h2>
        <p
            data-bsp-template
            data-bsp-template-options='{ "template": "test", "data": <% out.print(testData); %> }'
        ></p>

        <h2>Written from client side template (remote data):</h2>
        <p
            data-bsp-template
            data-bsp-template-options='{ "template": "test", "dataUrl": "<% out.print( testDataUrl.toString() ); %>" }'
        ></p>

        <h2>Written from client side template (using individual RequireJS module as would be used in prod)</h2>
        <p data-bsp-require-template-test></p>
    </body>
</html>