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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2zFvgkAUwPG9n4KxTUwQ7tCkTYeaxnRpm9jBkTTBgaTWDjg1/e5FQYv6UKh6gPw38+4dHAf+8pLL
//s+3ZPPqaR7ZthUHPH/mRe2t178Kgv/pt29NZMPmIE54G1r31fR0Grj/2I6cTz1DLXzcdayOqxaiXiSox
//V4m5Wowma11Ek5UmUSfOmL6Hn4u4m8nOxlVOXOfEvZx4L+e+6Xp+rIeXR+v5lT0rvmdbT98To9lcJeYq
//MVeLuVrM9cRcbzs3ecejwXD5kjd2ePV08czuYnbeoLNv0N03qNLB/r6ZfXlmuvBh+nGK15dnJzPfxunM
//Mn+IKxtswAZszorN8Z78Da5fUPf81Ah3LQ0Q0AAN0NShqikJzfpFOCahUUADNEBTd2iOLVqqZsYVPyHw
//AR/waVWVoyvhRwMN0ABNe6ocXaMqB3zAB3wu+IRqV6b1xrom+fGABmiAptGnU6WqnGqYkasc8AEf8Gl2
//lVPgUKpqfBT4gA/4NBOf4w6q6ln3ABIgAVI7qiFdN5I0+IAP+LSgGtLNqIYACZAAiR6twj1au4MZzv7f
//obUVT695uG8LaIAGaC6vP+sUzBTuzjqMD8zADMxcXnfWaZlRMAMzMENvlqlaBnqgB3rozDKGj4YZmIEZ
//+rLMVzjQAz3QQ1fWmfHxYAZmYIaeLPMVDvRAD/TQkWXsjAp6oAd66MeqybkVHMERHNGNVcFZFvRAD/TQ
//i1WT861TcvQL9ediCA==
