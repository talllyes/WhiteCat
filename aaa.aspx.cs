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
        test insert = new test
        {
            name = "2"
        };

        DB.test.InsertOnSubmit(insert);
        DB.SubmitChanges();


        var result = (from a in DB.test
                      orderby a.id descending
                      select a.name).FirstOrDefault();
        Label1.Text = result.ToString();
    }
}