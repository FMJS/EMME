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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmE2LwjAQhu/+ihwVhLSJ3YPgwbLIXlbBPXgsQvdQULuHelr875ukmgZNSz+3Lby38GYynU6emdKh
//NL4mP9eEUhKFb8E+SPiSOJSe4/D7JMQPn6zI7zQKWXAIEncurLhazeZEqAu5ZlL11CpVXbE+H6OL1Jlh
//beo8R1/k+Mnzn8Y8u5H19p187sYRrdKzGE0vmepZVdMDt3rgVg/c6iHLiKl6z2qa3b2/UemdPnRp8Xg7
//cdKRp/M23aJNVrSpH7+5X67FKrX4OkiL24QCakDdEtRNuH3e1BfhlEBaBf1yFqAD9B66d0XQdcLd6qBz
//gA7QuwS9ftNuE3PzCgE/4B9hl9cvVAP/+1mADtCH3uWbYG7v8oAf8A90EvNaGTp0Vh1/D6AD9N6mM5W6
//fBPM7V0e8AP+/rp84VCmTfg54Af8/w9/3UFN930fBYGCGP7XwPirbbMkzFQAfsA/xK9BR+gXznpKFMQf
//jwxtqQ==
