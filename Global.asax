﻿<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Routing" %>
<%@ Import Namespace="IdentityAuthority" %>

<script RunAt="server">

    void Application_Start(object sender, EventArgs e)
    {
        // 在應用程式啟動時執行的程式碼
        RegisterRoutes(RouteTable.Routes);
    }

    void RegisterRoutes(RouteCollection routes)
    {
        //忽略Url        
        routes.Ignore("{resource}.js");

        //加入路徑設定
        if (RouteConfig.自動配對泛型位置)
        {
            routes.Add("api", new Route(RouteConfig.泛型api前置路徑名稱 + "/{model}/{parameter}", new RouteNamespace.ApiRoute()));
        }
        else
        {
            routes.Add("api", new Route(RouteConfig.泛型api前置路徑名稱 + "/{com}/{model}/{parameter}", new RouteNamespace.ApiRoute()));
        }


        routes.Add("RootHtmlRoute", new Route("{htmlUrl}", new RouteNamespace.RootHtmlRoute()));
        routes.Add("ComHtmlRoute", new Route("{com}/{htmlUrl}", new RouteNamespace.Com_HtmlRoute()));
    }

    void Application_End(object sender, EventArgs e)
    {
        //  在應用程式關閉時執行的程式碼

    }

    void Application_Error(object sender, EventArgs e)
    {
        // 在發生未處理的錯誤時執行的程式碼
    }

    void Session_Start(object sender, EventArgs e)
    {
        // 在新的工作階段啟動時執行的程式碼    
    }

    void Application_AcquireRequestState(Object sender, EventArgs e)
    {
        if (HttpContext.Current.Session != null)
        {
            IdentityCheck check = new IdentityCheck();
            check.ProcessRequest(HttpContext.Current);
        }
    }

    void Session_End(object sender, EventArgs e)
    {
        // 在工作階段結束時執行的程式碼
        // 注意: 只有在  Web.config 檔案中將 sessionstate 模式設定為 InProc 時，
        // 才會引起 Session_End 事件。如果將 session 模式設定為 StateServer 
        // 或 SQLServer，則不會引起該事件。
    }

</script>
