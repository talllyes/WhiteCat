<%@ WebHandler Language="C#" Class="Index" %>

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.SessionState;
using System.Drawing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;

public class Index : IHttpHandler, IRequiresSessionState
{
    DataClassesDataContext DB = new DataClassesDataContext();
    public void ProcessRequest(HttpContext context)
    {
        string type = "";
        try
        {
            type = context.Request.QueryString["type"].ToString();
        }
        catch
        {

        }

        if (type.Equals("getSence"))
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
                                 End = a.EndDate < DateTime.Now
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


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}