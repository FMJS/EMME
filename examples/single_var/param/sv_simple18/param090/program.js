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
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 258;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 257";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 257";
outputs[15] = "id6_R_t2: 258;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGxRSE6OyscPKKLtsg+7QowzcQVjXHexp9LtP6wupfdw0xpfD/yZPnvgS5Yf8
//Cef7Q/J9SDhnceSFmzARt2x5F0d+ecz5bh99fKYNTyt2z36u40iE2zBxFukMeTq6WbCzqktWlVaVZK8k
//e12ymt9rVs3vNK86acfuPf7K6kLr1uuyoe421FVD3Wu4bnE/R/bw8sieX7Fm7des9vQeWdV7JdkryV6X
//7HXJXkX2qnpv/o43q/XpJZ+tcPl06cxlNrtp0CkGfWpQ/DUoy8uvi0+MPD89O5/5ts1mHq84hYAAAkAA
//CNhCwLlAoFrm5fAEEFc1h0F5oAE0gIbh/g+q5XTGpEFaoCEADaABNPSi4eLHYCwYBPnC+7Og5wkOUAAK
//QGGaPEFeDFYLLnqkCbV6cc6OGQNgAAyAYZKMwQYLrRMGcyzOcgdwAS7AxSS5g10u5GBcBOACXICLabMI
//MyyMkghjKvR8Iv3LABWgAlTMZcdDtbDSXkKhjBIK0AAaQMNs9kF0h8E0o1CGGQXAABgAYza7I/qAIQcD
//IwAYAANgzG/PRBsubOQUyjCn8EEFqAAVI+YUWnJpM6VwSS5MMwqwABbAwngZhVUU/ksoelNRyyeABbAA
//FuPlEwNhIQfCIgAWwAJYTJJN9KSiSzLRHopfh/RiWA==
