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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUGWvE0LigeHDC8qzMOORaiHgnMeupPsu9uuXem2t9ql6ZbBcytv3vRPWn6U
//h0i5XGXfq0xKkSZhPIszfSvGd2kSbY+lXCyTj8+84Wki7sXPdZroeB5napTPoM3RzUjsVAO2ahpVYnuJ
//7Q3YanmvRbW807Kq8o7Fe/pV1HWju1mnlnrQUjct9bDlutX9rMXDy6N4fsWadV+zvacP2Wqzl9heYnsD
//tjdgew3ba/Z7y3c8m0w3L3lnhbdPl88cF7PbBlU1GHGD+q9B2l5+Wn1i7Pn52eXMt3kxc30lOQQUEAAC
//QMAVAuoAgXqZx8MTwFzVGgZtQtAAGkDDcP8H9XKqU9JADmiIQANoAA29aDj4MTgVDJp94f1ZQJ4AFICC
//B3kCHQzWC657pAl79eqcyBgAA2C4hIzBBQudEwZrLJA7gAtw4UHu4JYLGowLZBHgAlycOYuww8IqibCm
//oplPGKVBBagAFb7seKgXltwlFMYqoQANoAE0eLMP4ngYbDMKY5lRAAyAATC82R3RBwwaDIwIYAAMgOHf
//nokuXLjIKQxyClABKi4gp2gkly5TioDlAhkFWAAL/mcUTlH4L6HoSwXyCWABLM6XTwyEBQ2EBbIJYAEs
//zpNN9KTimGSiOxS/wJViIA==
