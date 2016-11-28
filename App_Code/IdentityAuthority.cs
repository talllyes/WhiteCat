using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

/// <summary>
/// IdentityAuthority 的摘要描述
/// </summary>
/// 
namespace IdentityAuthority
{
    public class IdentityCheck : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        HttpContext allcontext;
        string url;
        public void ProcessRequest(HttpContext context)
        {
            //取得網址
           // url = context.Request.Url.Segments[context.Request.Url.Segments.Length-2].Split('/')[0];
          
        
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