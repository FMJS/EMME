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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 > 2) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 2;id8_R_t2: 0";
outputs[2] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[3] = "id6_R_t2: 0;id8_R_t2: 2";
outputs[4] = "id6_R_t2: 2;id8_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id8_R_t2: 2";
outputs[6] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[7] = "id6_R_t2: 2;id8_R_t2: 1";
outputs[8] = "id6_R_t2: 1;id8_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlj1rwzAYhPf+Co0JBBR9mdKSISE1HfoByZDRhLqDoYkzOFPpf69t2UExr8FY8nabON/Z0is/cJzn
//1+JyLThnWRolu6SQT2z5nKWP7ZrzU55+/5SG1w1bsd9ZlsrkkBRiUSZUvZov2J2qSdU4qiK9ivRqUrV7
//rVS7U6uK0nE6ZudKl47b1VWPrnt006NHPd9t9vPH1h9b9v6JmQ2fWef0Eam6XkV6FenVpFeTXkN6Tddr
//73i3ietLvptwe7oyuazSszbUeSjal8TNj0K+gk7b5P5QJe26HutXfk5X8fpt/zJ/4BTfEnyDb/Dtxfdt
//kmPpdq8iINsCbINtsO3FtvZlW0/DttvLJdgG22A7bC+/jXNEK2+yITo52AbbYDtoJx9CNt3IPbkW4Bpc
//g+up+vgQrvUUXLtdXIBrcA2uw3Zx49HFTbguDrbBNtgO2sXN6C5uwnVxcA2uwXXQLm5Gd/HBXP8DJfAv
//8w==
