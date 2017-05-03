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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUHavEkHigeHDC8qzMOORaiHgnMeupPsu9uuXem2t9ql6ZbBcytv3vRPWn6U
//h0i5XGXfq0xKkSZRPIszdSuCuzQZb4+lXCyTj8+84Wki7sXPdZqoeB5n4SifQZujm5HYqWq2ahpVYnuJ
//7dVstbzXolreaVkN847Fe/pV1FWju1mnlrpuqZuWetRy3ep+1uLh5VE8v2LNuq/Z3tNHbLXZS2wvsb2a
//7dVsr2F7zX5v+Y5nk+nmJe+s8Pbp8plBMbttMKwGx9yg+muQtpefVp8Ye35+djnzbV7MXF9JDgEFBIAA
//EHCFQHiAQL3MwfAEMFe1hsGEoAE0gIYB/w/q5QxPSQM5oEGDBtAAGnrRcPBjcCoYFPvC+7OAPAEoAAUP
//8gQ6GKwXXPVIE/bq1TmRMQAGwHAJGYMLFjonDNZYIHcAF+DCg9zBLRc0GBfIIsAFuDhzFmGHhVUSYU1F
//M5/I/zJABagAFb7seKgXltwlFMYqoQANoAE0eLMP4ngYbDMKY5lRAAyAATC82R3RBwwaDAwNMAAGwPBv
//z0QXLlzkFAY5BagAFReQUzSSS5cphWa5QEYBFsCC/xmFUxT+Syj6UoF8AlgAi/PlEwNhQQNhgWwCWACL
//82QTPak4JpnoDsUv7vFiAA==
