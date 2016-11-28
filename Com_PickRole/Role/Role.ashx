<%@ WebHandler Language="C#" Class="Role" %>

using System;
using System.Collections.Generic;
using System.Web;
using System.Web.SessionState;
using System.Drawing;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;

public class Role : IHttpHandler, IRequiresSessionState
{
    DataClassesDataContext DB = new DataClassesDataContext();
    HttpContext context;
    public void ProcessRequest(HttpContext contextX)
    {

        string parameter = contextX.Items["parameter"].ToString();
        context = contextX;
        try
        {
            MethodInfo apiService = Type.GetType("Role").GetMethod(parameter);
            apiService.Invoke(this, null);
        }
        catch
        {

        }

    }



    public void updateRoleNum()
    {

        string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
        dynamic json = JValue.Parse(str);
        bool flag = json.Info.flag;
        string name = json.Info.Name;
        string ss = json.Info.SceneID;
        int SceneID = Int32.Parse(ss);
        var star2 = (from a in DB.Pick
                     where a.star == "2" && a.SceneID == SceneID
                     select a).FirstOrDefault();
        var star3 = (from a in DB.Pick
                     where a.star == "3" && a.SceneID == SceneID
                     select a).FirstOrDefault();

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

            starInfo tt = new starInfo();
            tt.Name = name;
            tt.Star2 = json.star.star2;
            tt.Star3 = json.star.star3;
            tt.Star4 = json.star.star4;
            tt.time = DateTime.Now;


            var rank = (from a in DB.Rank2
                        where a.SceneID == SceneID && a.Type == "1"
                        select a).SingleOrDefault();
            List<starInfo> ranks = new List<starInfo>();
            if (rank != null)
            {
                ranks = JsonConvert.DeserializeObject<List<starInfo>>(rank.RankContent);


                var exst = (from a in ranks
                            where a.Name == tt.Name
                            select a).SingleOrDefault();
                if (exst != null)
                {
                    ranks.Remove(exst);
                    ranks.Add(tt);
                }
                else
                {
                    ranks.Add(tt);
                }

                var tranks = (from a in ranks
                              orderby a.Star4 descending, a.time
                              select a).Take(3);
                string stringJson = JsonConvert.SerializeObject(tranks);
                rank.RankContent = stringJson;
            }
            else
            {
                ranks.Add(tt);
                string stringJson = JsonConvert.SerializeObject(ranks);
                Rank2 insert = new Rank2()
                {
                    RankContent = stringJson,
                    SceneID = SceneID,
                    Type = "1"
                };
                DB.Rank2.InsertOnSubmit(insert);
            }

            var rankx2 = (from a in DB.Rank2
                          where a.SceneID == SceneID && a.Type == "2"
                          select a).SingleOrDefault();
            List<starInfo> ranksx2 = new List<starInfo>();
            if (rankx2 != null)
            {
                ranksx2 = JsonConvert.DeserializeObject<List<starInfo>>(rankx2.RankContent);
                var exst = (from a in ranksx2
                            where a.Name == tt.Name
                            select a).SingleOrDefault();
                if (exst != null)
                {
                    ranksx2.Remove(exst);
                    ranksx2.Add(tt);
                }
                else
                {
                    ranksx2.Add(tt);
                }

                var tranks = (from a in ranksx2
                              orderby a.Star4, a.time
                              select a).Take(3);
                string stringJson = JsonConvert.SerializeObject(tranks);
                rankx2.RankContent = stringJson;
            }
            else
            {
                ranksx2.Add(tt);
                string stringJson = JsonConvert.SerializeObject(ranksx2);
                Rank2 insert = new Rank2()
                {
                    RankContent = stringJson,
                    SceneID = SceneID,
                    Type = "2"
                };
                DB.Rank2.InsertOnSubmit(insert);
            }
        }
        DB.SubmitChanges();
        context.Response.ContentType = "text/plain";
        context.Response.Write("ok");
    }


    public void sceneNum()
    {
        try
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            string gg = json.SceneID;
            int SceneID = Int32.Parse(gg);

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
        catch
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("無效的指令");
        }
    }


    public void sceneRole()
    {
        try
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            string tt = json.SceneID;
            int SceneID = Int32.Parse(tt);
            var role = from a in DB.Pick
                       join b in DB.Role on a.RoleID equals b.RoleID
                       where a.SceneID == SceneID && a.star == "4"
                       select new
                       {
                           a.RoleID,
                           b.Name,
                           b.Src
                       };

            var scene = (from a in DB.Scene
                         where a.SceneID == SceneID
                         select new
                         {
                             a.Name,
                             a.SceneID,
                             a.Src,
                             a.EndDate,
                             a.StartDate,
                             End = a.EndDate < DateTime.Now,
                             Start = a.StartDate > DateTime.Now,
                             a.Chance
                         }).FirstOrDefault();

            if (scene != null)
            {
                Dictionary<string, dynamic> result = new Dictionary<string, dynamic>();
                result.Add("role", role);
                result.Add("scene", scene);
                context.Response.ContentType = "text/plain";
                context.Response.Write(JsonConvert.SerializeObject(result));
            }
            else
            {
                context.Response.ContentType = "text/plain";
                context.Response.Write("沒有場景");
            }
        }
        catch
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("無效的指令");
        }
    }

    public void clear()
    {
        try
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            string name = json.Info.Name;
            int SceneID = json.Info.SceneID;
            starInfo tt = new starInfo();
            tt.Name = name;
            tt.Star2 = json.star.star2;
            tt.Star3 = json.star.star3;
            tt.Star4 = json.star.star4;
            tt.time = DateTime.Now;
            var rank = (from a in DB.Rank2
                        where a.SceneID == SceneID && a.Type == "3"
                        select a).SingleOrDefault();
            List<starInfo> ranks = new List<starInfo>();
            if (rank != null)
            {
                ranks = JsonConvert.DeserializeObject<List<starInfo>>(rank.RankContent);


                var exst = (from a in ranks
                            where a.Name == tt.Name
                            select a).SingleOrDefault();
                if (exst != null)
                {
                    ranks.Remove(exst);
                    ranks.Add(tt);
                }
                else
                {
                    ranks.Add(tt);
                }

                var tranks = (from a in ranks
                              orderby (a.Star4 + a.Star3 + a.Star2) descending, a.time
                              select a).Take(3);
                string stringJson = JsonConvert.SerializeObject(tranks);
                rank.RankContent = stringJson;
            }
            else
            {
                ranks.Add(tt);
                string stringJson = JsonConvert.SerializeObject(ranks);
                Rank2 insert = new Rank2()
                {
                    RankContent = stringJson,
                    SceneID = SceneID,
                    Type = "3"
                };
                DB.Rank2.InsertOnSubmit(insert);
            }

            var rankx2 = (from a in DB.Rank2
                          where a.SceneID == SceneID && a.Type == "4"
                          select a).SingleOrDefault();
            List<starInfo> ranksx2 = new List<starInfo>();
            if (rankx2 != null)
            {
                ranksx2 = JsonConvert.DeserializeObject<List<starInfo>>(rankx2.RankContent);
                var exst = (from a in ranksx2
                            where a.Name == tt.Name
                            select a).SingleOrDefault();
                if (exst != null)
                {
                    ranksx2.Remove(exst);
                    ranksx2.Add(tt);
                }
                else
                {
                    ranksx2.Add(tt);
                }

                var tranks = (from a in ranksx2
                              orderby (a.Star4 + a.Star3 + a.Star4), a.time
                              select a).Take(3);
                string stringJson = JsonConvert.SerializeObject(tranks);
                rankx2.RankContent = stringJson;
            }
            else
            {
                ranksx2.Add(tt);
                string stringJson = JsonConvert.SerializeObject(ranksx2);
                Rank2 insert = new Rank2()
                {
                    RankContent = stringJson,
                    SceneID = SceneID,
                    Type = "4"
                };
                DB.Rank2.InsertOnSubmit(insert);
            }





            DB.SubmitChanges();
            context.Response.ContentType = "text/plain";
            context.Response.Write("ok");
        }
        catch
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("無效的指令");
        }
    }

    public void getRank()
    {
        try
        {
            string str = new System.IO.StreamReader(context.Request.InputStream).ReadToEnd();
            dynamic json = JValue.Parse(str);
            int SceneID = json.SceneID;
            var resultTemp = from a in DB.Rank2
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
        catch
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write("無效的指令");
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
        public DateTime time;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}