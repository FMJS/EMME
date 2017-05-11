// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 3;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[7] = "id6_R_t2: 512;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFPgzAUB/C7n6JHTZZ09FEwGg8uZvGiJvOwIzHBA4lzHtjJ7LsLgxHGHspKgW3+b8vr64Cy/LL+
//UymXq/hrFUspotALZkGsbsT4Ngr97WcpF8vw/SNpeJyIO/F9GYUqmAexM0pm0ObT1UjsVF22qktVYnuJ
//7XXZanavaTW706zqJB2Lt+gzratSd7lONXW3pq5r6l7NdfP7WYv75wfx9II1a75mlaf32Gq5l9heYntd
//ttdlezXbq6u92TueTaabl7yzwtunS2aO09l1g04+6HOD6rdB2l5+mv/E2O/nZ2czX+fpzPWFBAJAAAh0
//ioCzh0CxzOPuCWCuagyDdhRoAA2gobv/B8VyOn3SQKABNICGwWnY+2PQFwyKfeHtWShvJRRQAApAYZg8
//gfYGiwVXLdKESj3/TsAAGADDKWQMNlhonDAYY7G7uQAX4AJcDJI72OWCwAW4ABfnmkWYYWGURFjZhvje
//NagAFaDiWE48FAtL9hIKDRpAA2g47XMQh8NgmlFow00HwAAYAONoTke0AYMABsAAGP/pzEQTLmzkFIab
//ER/Hq0AFqOgzpygllzZTCpflAiyABbBw/BmFVRT+SijaUlHZbgALYAEseswnOsKCgAWwABZnlU20pOKQ
//ZKI5FD+lq2JE
