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
            bool flag = json.Info.flag;
            string name = json.Info.Name;
            int SceneID = json.Info.SceneID;
            var star2 = (from a in DB.Pick
                         where a.star == "2" && a.RoleID == 0 && a.SceneID == SceneID
                         select a).SingleOrDefault();
            var star3 = (from a in DB.Pick
                         where a.star == "3" && a.RoleID == 0 && a.SceneID == SceneID
                         select a).SingleOrDefault();

            foreach (string temp in json.role)
            {
                if (temp.Equals("s2"))
                {
                    star2.Num = star2.Num + 1;
                }
                else if (temp.Equals("s3"))
                {
                    star3.Num = star3.Num + 1;
                }
                else
                {
                    int RoleID = Convert.ToInt32(temp);
                    var star4 = (from a in DB.Pick
                                 where a.star == "4" && a.RoleID == RoleID && a.SceneID == SceneID
                                 select a).SingleOrDefault();
                    star4.Num = star4.Num + 1;
                }
            }
            if (flag)
            {
                var rank = (from a in DB.Rank
                            where a.SceneID == SceneID && a.Type == "1"
                            select a).SingleOrDefault();
                starInfo tt = new starInfo();
                tt.Name = name;
                tt.Star2 = json.star.star2;
                tt.Star3 = json.star.star3;
                tt.Star4 = json.star.star4;
                string stringJson = JsonConvert.SerializeObject(tt);
                if (rank != null)
                {
                    dynamic rankJson = JValue.Parse(rank.RankContent);
                    int nowStar4Num = rankJson.Star4;
                    if (tt.Star4 > nowStar4Num)
                    {
                        rank.RankContent = stringJson;
                    }
                }
                else
                {
                    Rank insert = new Rank()
                    {
                        RankContent = stringJson,
                        SceneID = SceneID,
                        Type = "1"
                    };
                    DB.Rank.InsertOnSubmit(insert);
                }

                var rank2 = (from a in DB.Rank
                             where a.SceneID == SceneID && a.Type == "2"
                             select a).SingleOrDefault();
                if (rank2 != null)
                {
                    dynamic rankJson = JValue.Parse(rank2.RankContent);
                    int nowStar4Num = rankJson.Star4;
                    if (tt.Star4 < nowStar4Num)
                    {
                        rank2.RankContent = stringJson;
                    }
                }
                else
                {
                    Rank insert = new Rank()
                    {
                        RankContent = stringJson,
                        SceneID = SceneID,
                        Type = "2"
                    };
                    DB.Rank.InsertOnSubmit(insert);
                }
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
                               Count = g.Sum(p => p.Num)
                           };
            Dictionary<string, dynamic> Allreuslt = new Dictionary<string, dynamic>();
            Dictionary<string, double> reuslt = new Dictionary<string, double>();

            int count = 0;
            foreach (var temp in pickTemp)
            {
                count = count + temp.Count;
                reuslt.Add("star" + temp.Key, temp.Count);
            }

            reuslt.Add("starC", count);
            Allreuslt.Add("star", reuslt);
            var star4 = from c in (from a in DB.Pick
                                   where a.star.Equals("4") && a.SceneID == SceneID
                                   group a by a.RoleID into g
                                   select new
                                   {
                                       RoleID = g.Key,
                                       Count = g.Sum(p => p.Num)
                                   })
                        join d in DB.Role on c.RoleID equals d.RoleID
                        orderby c.Count descending
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

            Allreuslt.Add("starC2", count2);
            Allreuslt.Add("star4", reuslt2);


            context.Response.ContentType = "text/plain";
            context.Response.Write(JsonConvert.SerializeObject(Allreuslt));
        }
        else if (type.Equals("SceneRole"))
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            int SceneID = json.SceneID;
            var result = from a in DB.Pick
                         join b in DB.Role on a.RoleID equals b.RoleID
                         where a.SceneID == SceneID && a.star == "4"
                         select new
                         {
                             a.RoleID,
                             b.Name,
                             b.Src
                         };

            context.Response.ContentType = "text/plain";
            context.Response.Write(JsonConvert.SerializeObject(result));
        }
        else if (type.Equals("Clear"))
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            string name = json.Info.Name;
            int SceneID = json.Info.SceneID;

            var rank3 = (from a in DB.Rank
                         where a.SceneID == SceneID && a.Type == "3"
                         select a).SingleOrDefault();
            starInfo tt = new starInfo();
            tt.Name = name;
            tt.Star2 = json.star.star2;
            tt.Star3 = json.star.star3;
            tt.Star4 = json.star.star4;
            string stringJson = JsonConvert.SerializeObject(tt);
            if (rank3 != null)
            {
                dynamic rankJson = JValue.Parse(rank3.RankContent);
                int nowStar = rankJson.Star4 + rankJson.Star3 + rankJson.Star2;
                int all = tt.Star4 + tt.Star3 + tt.Star2;
                if (all < nowStar)
                {
                    rank3.RankContent = stringJson;
                }
            }
            else
            {
                Rank insert = new Rank()
                {
                    RankContent = stringJson,
                    SceneID = SceneID,
                    Type = "3"
                };
                DB.Rank.InsertOnSubmit(insert);
            }
            DB.SubmitChanges();
            context.Response.ContentType = "text/plain";
            context.Response.Write("ok");
        }
        else if (type.Equals("GetRank"))
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            int SceneID = json.SceneID;
            var resultTemp = from a in DB.Rank
                             where a.SceneID == SceneID
                             select a;
            Dictionary<string, dynamic> result = new Dictionary<string, dynamic>();

            foreach (var temp in resultTemp)
            {
                result.Add("type" + temp.Type, JValue.Parse(temp.RankContent));
            }
            context.Response.ContentType = "text/plain";
            context.Response.Write(JsonConvert.SerializeObject(result));
        }
    }

    public class RoleInfo
    {
        public int RoleID;
        public string Name;
        public double Count;
    }

    public class starInfo
    {
        public string Name;
        public int Star2;
        public int Star3;
        public int Star4;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}