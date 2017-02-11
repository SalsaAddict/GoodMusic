using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Xml;

namespace GoodMusic
{
    public class Execute : IHttpHandler
    {
        private class Procedure
        {
            [JsonProperty("name")]
            public string Name { get; set; }
            [JsonProperty("parameters")]
            public Dictionary<string, Parameter> Parameters { get; set; } = new Dictionary<string, Parameter>();
        }
        private class Parameter
        {
            [JsonProperty("value")]
            public object Value { get; set; } = null;
            [JsonProperty("isObject")]
            public bool Xml { get; set; } = false;
        }
        private class Response
        {
            [JsonProperty("success")]
            public bool Success;
            [JsonProperty("data")]
            public object Data = null;
            public Response(XmlDocument Document)
            {
                Success = true;
                Data = JsonConvert.DeserializeObject(JsonConvert.SerializeXmlNode(Document, Newtonsoft.Json.Formatting.None, true));
            }
            public Response(string Error)
            {
                Success = false;
                Data = Error;
            }
            public string ToJson()
            {
                return JsonConvert.SerializeObject(this);
            }
        }
        public void ProcessRequest(HttpContext Context)
        {
            Context.Response.ContentType = "application/json";
            Context.Response.ContentEncoding = Encoding.UTF8;
            Procedure Procedure = null; Response Response;
            try
            {
                using (StreamReader Reader = new StreamReader(Context.Request.InputStream, Encoding.UTF8))
                {
                    try
                    {
                        Procedure = JsonConvert.DeserializeObject<Procedure>(Reader.ReadToEnd());
                    }
                    catch (Exception Ex) { Response = new Response(Ex.Message); }
                    finally { Reader.Close(); }
                }
                using (SqlConnection Connection = new SqlConnection(WebConfigurationManager.ConnectionStrings["Database"].ConnectionString))
                {
                    Connection.Open();
                    try
                    {
                        using (SqlTransaction Transaction = Connection.BeginTransaction(IsolationLevel.Serializable))
                        {
                            try
                            {
                                using (SqlCommand Command = new SqlCommand(Procedure.Name, Connection, Transaction))
                                {
                                    Command.CommandType = CommandType.StoredProcedure;
                                    foreach (KeyValuePair<string, Parameter> Parameter in Procedure.Parameters)
                                    {
                                        if (Parameter.Value.Xml)
                                        {
                                            Command.Parameters.AddWithValue(Parameter.Key,
                                                JsonConvert.DeserializeXmlNode(JsonConvert.SerializeObject(Parameter.Value.Value),
                                                "object", true).InnerXml);
                                        }
                                        else Command.Parameters.AddWithValue(Parameter.Key, Parameter.Value.Value);
                                    }
                                    XmlDocument Document = new XmlDocument();
                                    using (XmlReader Reader = Command.ExecuteXmlReader())
                                    {
                                        Document.Load(Reader);
                                        Reader.Close();
                                    }
                                    Response = new Response(Document);
                                    Transaction.Commit();
                                }
                            }
                            catch (Exception Ex)
                            {
                                Transaction.Rollback();
                                Response = new Response(Ex.Message);
                            }
                        }
                    }
                    catch (Exception Ex) { Response = new Response(Ex.Message); }
                    finally { Connection.Close(); }
                }
            }
            catch (Exception Ex) { Response = new Response(Ex.Message); }
            Context.Response.Write(Response.ToJson());
        }
        public bool IsReusable { get { return false; } }
    }
}