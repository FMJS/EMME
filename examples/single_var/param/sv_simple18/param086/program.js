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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 257";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 257";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1LwzAYB/C7nyJHhUGWpGlA8eCQ4UWFedixCPVQcM5Dd5J9d9u1K1n3VLs0fTn8b+XJk76k5Uf5
//E863u/R7l3LOkjiMVlEqb9n8LonN8ZjzzTb++Mwanhbsnv1cJ7GM1lEqZtkMdTi6mbGTakBWtVVVZK8i
//ewOyWtxrXi3utKiKrGPznnzldWl123XVUA8a6rqhHjZct7yfPXt4eWTPr1iz9mtWe/qQrNq9iuxVZG9A
//9gZkryZ7db23eMerxfLwkk9W+Ph02cx5PrtpUJSDhhqUfw2q4+WX5SdGnp+eXcx8W+cz91ecQkAAASAA
//BHwhIM4QqJZ53j8BxFWdYZA6BA2gATT0939QLacYkgblgQYDGkADaOhEw9mPwVAwSPKFd2fBzhMEUAAK
//QGGcPEGdDVYLLjukCbV6ec4LMwbAABgAwygZgw8WWicMzlic5g7gAlyAi1FyB79cqN64MOACXICLcbMI
//NyyckghnKux8IvvLABWgAlRMZcdDtbDKX0KhnRIK0AAaQMNk9kFcDoNrRqEdMwqAATAAxmR2R3QBQ/UG
//hgEYAANgTG/PRBsufOQU2jGnMKACVICKAXMKK7n0mVIEJBeuGQVYAAtgYbiMwisK/yUUXamo5xPAAlgA
//i+HyiZ6wUD1hYYAFsAAWo2QTHam4JJloD8UvfrViUA==
