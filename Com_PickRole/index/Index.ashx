<%@ WebHandler Language="C#" Class="Index" %>

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

public class Index : IHttpHandler, IRequiresSessionState
{
    DataClassesDataContext DB = new DataClassesDataContext();
    HttpContext context;
    public void ProcessRequest(HttpContext contextX)
    {
        string parameter = contextX.Items["parameter"].ToString();
        context = contextX;
        try
        {
            MethodInfo apiService = Type.GetType("Index").GetMethod(parameter);
            apiService.Invoke(this, null);
        }
        catch
        {
            context.Response.Write("找不到資源");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
    public void aa()
    {
   context.Response.ContentType = "text/plain";
            context.Response.Write(DateTime.Now);
    }



    //取得場景資料
    public void getSence()
    {
        try
        {
            var result = from a in DB.Scene
                         orderby a.SceneID descending
                         select new
                         {
                             a.SceneID,
                             a.Name,
                             a.Src,
                             a.StartDate,
                             a.EndDate,
                             End = a.EndDate < DateTime.Now,
                             Start = a.StartDate > DateTime.Now
                         };
            context.Response.ContentType = "text/plain";
            context.Response.Write(JsonConvert.SerializeObject(result));
        }
        catch
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("無效的指令");
        }
    }
}