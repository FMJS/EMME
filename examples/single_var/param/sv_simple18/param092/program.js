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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 258;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 258;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 258;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 769";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 769";
outputs[15] = "id6_R_t2: 258;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGxRSE6NuY4eVUXbZBt2hRym4g7CuO9jT6HefViupPm42xpfD/yZPnvgS5Yf8
//Cee7ffK9TzhnceSFqzARd2x+H0f+6Zjz7S76+Ewbnhfsgf1cx5EI12HizNIZ8nh0M2NnVZesKq0qyV5J
//9rpkNb/XrJrfaV510o7tJv7K6kLr1uuyoe421FVD3Wu4bnE/B/b4+sRe3rBm7des8vQeWdV7JdkryV6X
//7HXJXkX2qmpv/o5Xi+XxJZ+t8Onp0pnzbHbToFMM+tSg+GtQni6/LD4x8vz07Hzm+zqbebjiFAICCAAB
//IGALAaeGQLnM8/4JIK5qDoPyQANoAA39/R+Uy+kMSYO0QEMAGkADaOhEQ+3HYCgYBPnCu7Og5wkOUAAK
//QGGcPEHWBssFFx3ShEq9OOeFGQNgAAyAYZSMwQYLrRMGcyzOcgdwAS7AxSi5g10uZG9cBOACXICLcbMI
//MyyMkghjKvR8wvcCUAEqQMVUdjyUCyvtJRTKKKEADaABNExmH8TlMJhmFMowowAYAANgTGZ3RBcwZG9g
//BAADYACM6e2ZaMOFjZxCGeYUt6ACVICKAXMKLbm0mVK4JBemGQVYAAtgYbiMwioK/yUUnamo5BPAAlgA
//i+HyiZ6wkD1hEQALYAEsRskmOlJxSTLRHopfLRdimA==
