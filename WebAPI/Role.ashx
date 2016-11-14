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
        string type = context.Request.QueryString["type"].ToString();
        if (type.Equals("updateRoleNum"))
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);


            foreach (string temp in json.role)
            {
                int RoleID = 0;
                string star = "2";
                if (temp.Equals("s2"))
                {
                    star = "2";
                }
                else if (temp.Equals("s3"))
                {
                    star = "3";
                }
                else
                {
                    RoleID = Convert.ToInt32(temp);
                    star = "4";
                }

                Pick insert = new Pick()
                {
                    GUID = json.Info.GUID,
                    Name = json.Info.Name,
                    RoleID = RoleID,
                    SceneID = json.Info.SceneID,
                    star = star,
                    PickDate = DateTime.Now
                };
                DB.Pick.InsertOnSubmit(insert);
            }
            DB.SubmitChanges();
            context.Response.ContentType = "text/plain";
            context.Response.Write("ok");
        }
        else if (type.Equals("sceneNum"))
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            int SceneID = json.SceneID;
            var pickTemp = from a in DB.Pick
                           where a.SceneID == SceneID
                           group a by a.star into g
                           select new
                           {
                               g.Key,
                               Count = g.Count()
                           };
            Dictionary<string, dynamic> Allreuslt = new Dictionary<string, dynamic>();
            Dictionary<string, double> reuslt = new Dictionary<string, double>();


            int count = 0;
            foreach (var temp in pickTemp)
            {
                count = count + temp.Count;
                reuslt.Add("star" + temp.Key, temp.Count);
            }
            reuslt["star2"] = reuslt["star2"] / count;
            reuslt["star3"] = reuslt["star3"] / count;
            reuslt["star4"] = reuslt["star4"] / count;
            reuslt.Add("starC", count);
            Allreuslt.Add("star", reuslt);
            var star4 = from c in (from a in DB.Pick
                                   where a.star.Equals("4") && a.SceneID == SceneID
                                   group a by a.RoleID into g
                                   select new
                                   {
                                       RoleID = g.Key,
                                       Count = g.Count()
                                   })
                        join d in DB.Role on c.RoleID equals d.RoleID
                        select new
                        {
                            c.RoleID,
                            d.Name,
                            c.Count
                        };
            int count2 = 0;

            List<RoleInfo> reuslt2 = new List<RoleInfo>();
            foreach (var temp in star4)
            {
                RoleInfo tt = new RoleInfo();
                tt.Name = temp.Name;
                tt.RoleID = (int)temp.RoleID;
                tt.Count = temp.Count;
                count2 = count2 + temp.Count;
                reuslt2.Add(tt);
            }

            foreach (var temp in reuslt2)
            {
                temp.Count = temp.Count / count2;
            }

            Allreuslt.Add("star4",reuslt2);


            context.Response.ContentType = "text/plain";
            context.Response.Write(JsonConvert.SerializeObject(Allreuslt));
        }
    }

    public class RoleInfo
    {
        public int RoleID;
        public string Name;
        public double Count;
    }


    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}