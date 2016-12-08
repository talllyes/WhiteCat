<%@ WebHandler Language="C#" Class="keyin" %>

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.SessionState;
using System.Drawing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;

public class keyin : IHttpHandler, IRequiresSessionState
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
                             where a.StartDate < DateTime.Now.AddHours(8) && a.EndDate > DateTime.Now.AddHours(8)
                             select a;
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