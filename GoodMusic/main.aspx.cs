using System;

namespace GoodMusic
{
    public partial class Main : System.Web.UI.Page
    {
        public string RandomGuid = Guid.NewGuid().ToString();
        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}