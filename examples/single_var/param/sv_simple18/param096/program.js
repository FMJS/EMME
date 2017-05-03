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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 259;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 259;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 3;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 259;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[13] = "id6_R_t2: 3;id7_R_t2: 769";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 769";
outputs[15] = "id6_R_t2: 259;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQQmznFMbemioYRu2kK6yFICdiE0TRdmVfLu1WjEmGNrxvGy+Hdy5oyXUT7k
//Z6Tc7uLvXSyliEIvWAaxuhPT+yicHY+l3GzDj8+k4XkuHsTPdRSqYBXEziSZQYejm4k4qbpsVZeqxPYS
//2+uy1exe02p2p1nVSTo26+grratSd7lONXW3pq5r6l7NdfP72YvH1yfx8oY1a75mlaf32Gq5l9heYntd
//ttdlezXbq6u92TtezheHl3yywsenS2ZO09l1g04+OOMG1V+DdLz8Iv/E2PPzs7OZ76t05v5KcggQEAAC
//QMAWAs4ZAsUyT7sngLmqMQxKe6ABNICG7v4PiuV0+qSBLNDggwbQABpa0XD2Y9AXDIp94e1ZKOcJDlAA
//CkBhmDyBzgaLBVct0oRKPT/nhRkDYAAMgGGQjMEGC40TBmMsTnMHcAEuwMUguYNdLqgzLnxwAS7AxbBZ
//hBkWRkmEMRXlfGLm3YIKUAEqxrLjoVhYspdQaKOEAjSABtAwmn0Ql8NgmlFow4wCYAAMgDGa3RFtwKDO
//wPABBsAAGOPbM9GECxs5hTbMKXxQASpARY85RSm5tJlSuCwXphkFWAALYKG/jMIqCv8lFG2pqOYTwAJY
//AIv+8omOsKCOsPCBBbAAFoNkEy2puCSZaA7FLzZWYqA=
