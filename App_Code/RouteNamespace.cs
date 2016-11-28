using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Compilation;
using System.Web.Hosting;
using System.Web.Routing;

/// <summary>
/// RouteNamespace 的摘要描述
/// </summary>
/// 
namespace RouteNamespace
{
    //根目錄Html的自動Route
    public class RootHtmlRoute : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            var routeData = requestContext.RouteData;
            //取出參數
            string htmlUrl = Convert.ToString(routeData.Values["htmlUrl"]);
            //檢查看看有無該對應的HTML?
            string htmlName = htmlUrl + ".html";
            if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + htmlUrl + "/" + htmlName)))
            {
                //讀取該網頁
                return BuildManager.CreateInstanceFromVirtualPath("~/" + RouteConfig.主元件前置名稱 + htmlUrl + "/" + htmlName, typeof(IHttpHandler)) as IHttpHandler;
            }
            else
            {
                //放送~/notFound.html內容
                return BuildManager.CreateInstanceFromVirtualPath("~/notFound.html", typeof(IHttpHandler)) as IHttpHandler;
            }
        }
    }

    //Com目錄Html的自動Route
    public class Com_HtmlRoute : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            var routeData = requestContext.RouteData;
            //取出參數
            string htmlUrl = Convert.ToString(routeData.Values["htmlUrl"]);
            string com = Convert.ToString(routeData.Values["com"]);

            //檢查看看有無該對應的HTML?
            string htmlName = htmlUrl + ".html";
            if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + com + "/" + htmlUrl + "/" + htmlName)))
            {
                //讀取該網頁
                return BuildManager.CreateInstanceFromVirtualPath("~/" + RouteConfig.主元件前置名稱 + com + "/" + htmlUrl + "/" + htmlName, typeof(IHttpHandler)) as IHttpHandler;
            }
            else
            {
                //放送~/notFound.html內容
                return BuildManager.CreateInstanceFromVirtualPath("~/notFound.html", typeof(IHttpHandler)) as IHttpHandler;
            }
        }
    }

    //Api目錄的ashx自動Route
    public class ApiRoute : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            var routeData = requestContext.RouteData;

            //取出參數
            string com = Convert.ToString(routeData.Values["com"]);
            string model = Convert.ToString(routeData.Values["model"]);
            string parameter = Convert.ToString(routeData.Values["parameter"]);
            if (RouteConfig.自動配對泛型位置)
            {
                com = Convert.ToString(routeData.Values["com"]);
            }

            //加入參數值
            HttpContext.Current.Items.Add("parameter", parameter);

            //檢查看看有無該Model對應的ASHX?
            string ashxName = model + ".ashx";
            if (com.Equals(model))
            {
                if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + com + "/" + ashxName)))
                {
                    //導向指定的ASHX
                    return BuildManager.CreateInstanceFromVirtualPath("~/" + RouteConfig.主元件前置名稱 + com + "/" + ashxName, typeof(IHttpHandler)) as IHttpHandler;
                }
                else
                {
                    //放送~/noFound.html內容
                    return BuildManager.CreateInstanceFromVirtualPath("~/notFound.html", typeof(IHttpHandler)) as IHttpHandler;
                }
            }
            else
            {
                if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + com + "/" + model + "/" + ashxName)))
                {
                    //導向指定的ASHX
                    return BuildManager.CreateInstanceFromVirtualPath("~/" + RouteConfig.主元件前置名稱 + com + "/" + model + "/" + ashxName, typeof(IHttpHandler)) as IHttpHandler;
                }
                else
                {
                    //放送~/noFound.html內容
                    return BuildManager.CreateInstanceFromVirtualPath("~/notFound.html", typeof(IHttpHandler)) as IHttpHandler;
                }
            }
        }
    }

    //讀取全部JS
    public class LoadAllJs : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            string filename = System.IO.Path.GetFileName(context.Request.PhysicalPath);
            filename = filename.Split('.')[0];
            string InitDirectory = AppDomain.CurrentDomain.BaseDirectory + RouteConfig.主元件前置名稱 + filename + "\\";
            if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + filename + "/" + filename + ".js")))
            {
                context.Response.WriteFile(InitDirectory + filename + ".js");
            }
            string[] folder = Directory.GetDirectories(InitDirectory);
            foreach (string temp in folder)
            {
                string folderName = Path.GetFileName(temp);
                if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + filename + "/" + folderName + "/" + folderName + ".js")))
                {
                    context.Response.WriteFile(temp + "\\" + folderName + ".js");
                }
            }
            string[] files = Directory.GetFiles(InitDirectory);
            foreach (string temp in files)
            {
                string tempName = Path.GetFileName(temp).Split('.')[0];
                if (File.Exists(HostingEnvironment.MapPath("~/" + RouteConfig.主元件前置名稱 + filename + "/" + tempName + ".js")))
                {
                    if (!tempName.Equals(filename))
                    {
                        context.Response.WriteFile(temp);
                    }
                }
            }
        }
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }

    //禁止直接讀取
    public class NotLoad : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            var handler = BuildManager.CreateInstanceFromVirtualPath("~/notFound.html", typeof(IHttpHandler)) as IHttpHandler;
            context.Server.Transfer(handler, false);
        }
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }

}