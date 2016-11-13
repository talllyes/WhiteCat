using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class aaa : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        DataClassesDataContext DB = new DataClassesDataContext();
        Table insert = new Table
        {
            name = "2"
        };

        DB.Table.InsertOnSubmit(insert);
        DB.SubmitChanges();


        var result = from a in DB.Table
                     select a;
        Label1.Text = result.ToString();
    }
}