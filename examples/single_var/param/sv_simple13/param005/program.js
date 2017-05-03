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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[1]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 65537;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65793;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[9] = "id6_R_t3: 1;id7_R_t3: 1";
outputs[10] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[11] = "id6_R_t3: 257;id7_R_t3: 1";
outputs[12] = "id6_R_t3: 65536;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 65537;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 65792;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 65793;id7_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm8FOwkAQhu8+RY+amJR22TZqPEiM8aImePBITPBAIuqhngzvbksLLLBFoTtbAt+tmd0daLf/xx9m
//Jww/v7Ov7ywMg9EwGfQHmboMOlejYTq7DsPx5/DtPZ9w3wuug5/T0TAevAyy6DxfoaZXZ+dBHu0W13ER
//1dOrMlrmLKJlxjIa5TPGr6OPIh4bOcy4qol3jexmXNfEk5rPrb7PJLh5vA0eng7x3qbxxR2Z2RdRbY0m
//1gxmXmXNq6x5lTWvsuZdPOvEGjXnautcvTq33ON+7266yUs7N3tq+cpOsbpuMNo0GG8aVNVgumllal9Z
//ffG76uW05revLlc+vxQrJyehTeYRMkfmxyfz5kpeDM43viMvcsun7iz9WCeIH/HzG99E/PMNjnyKXzkQ
//f4r4Ef/xib/pj3vb0jdfNrdAwA0ABNxAI1rMH4lXJJgbgRtA/Ii/BTfQjvTtbqA5EBKtFX4AJOAHtvjf
//cJ0X85uPfUJBO5E/jgD5Uxlo4AjaEb/dEbhAQnoRgwSQgCPYtiTQNhKUIBIUSAAJx4eEZoWC/fQICucA
//JsBEi85h7T/EtkHRtb6aOAeQABJ8OIe9A8Lf9QaXmDB7ECIQASJwDVI9COuDBmB270BYiVc5t+xLQPpI
//n+qDUF+CC+H/uythZxwsn04ECAABLyDUq+AWCEoMCClAAAicWJTuX5DzBz4ggWsAErgGDz0NbjHxxwFm
//XANAAAj73OfgwzVIQWK19wFMgAl8g1Dvg1tQaEEk4BxAAhUJ8X4IH85BDhPLJx3BBJjAOYj0SMhVKfxg
//QoEJMMHpR9m+Cd+1CxwG6AAdB9JLIVfRwGGACTBxEP0VvuscLtHxCxe3ra8=
