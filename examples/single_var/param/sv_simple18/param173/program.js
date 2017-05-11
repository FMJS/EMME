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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1Lw0AQBuC7v2KPCoVtdrItKB4sUryoUA89BiEeAtZ6SE/S/27SfLBpJppuNh+H91ZmZ5tkUx7K
//y0i5P8Tfh1hKEYWLYBPE6lbM76JwWXyWcrcPPz6ThqeVuBc/11Gogm0Qe7NkB50+3cxEpeqzVW1Uie0l
//ttdnq9m9ptXsTrOql3Ts3qOvtK6MbrNODXW/oa4b6ouG6+b3cxQPL4/i+RVn1v7Mzp5+wVbNXmJ7ie31
//2V6f7dVsrz7vzd7xZrU+veTKCRdPl+ycp7ubFr18ccktqr8Wqbj8Ov+Jsd/P7852vm3TnccrySFAQAAI
//AAFXCHg1BMpjnvdPAHNVaxi0p0ADaAAN/f0/KI/TG5IGckCDBg2gATR0oqH2x2AoGBT7wruzYOYJCigA
//BaAwTp5AtcXywFWHNOGsnn/nhRkDYAAMgGGUjMEFC60TBmssqrkDuAAX4GKU3MEtF9QbFxpcgAtwMW4W
//YYeFVRJhTQXmHQAFoJjkvEN5sOQun9BW+QRgAAyAYSIzEJezYJtPaMt8AlyAC3AxkbmILlxQb1xgVgJc
//gIvJzUq0wcJFPqGt8gkEmYACUAyZTxh5pct0wmex0JidAApAYeLZhFMS/ksmukKBuQlQASrGyiV6ooJ6
//ogIzE6ACVIyRSXSE4pJEoj0TvxCZXtg=
