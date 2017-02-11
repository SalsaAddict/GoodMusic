using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GoodMusic
{
    public partial class Index : System.Web.UI.Page
    {
        public string RandomGuid = Guid.NewGuid().ToString();
        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}