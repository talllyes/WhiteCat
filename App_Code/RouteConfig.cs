using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// RouteConfig 的摘要描述
/// </summary>
public static class RouteConfig
{
    //可設置為""，如檔案放置於Com_abc資料夾下，html位置則為abc/檔案名稱，即Com_可省略不打
    public static string 主元件前置名稱 = "Com_";

    //不可為""，泛型讀取路徑則為"API/主元件名稱/泛型名稱/參數"
    public static string 泛型api前置路徑名稱 = "API";

    //設為true則泛型讀取路徑則為"API/泛型名稱/參數"，但不同主元件之間的泛型名稱不可重複
    public static bool 自動配對泛型位置 = false;

}