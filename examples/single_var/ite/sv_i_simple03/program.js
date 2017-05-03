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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 == id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 0";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[8] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[9] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[10] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 1";
outputs[11] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 1";
outputs[12] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[13] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[14] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2";
outputs[15] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[16] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[17] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 2";
outputs[18] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[19] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[20] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[22] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
outputs[23] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[24] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[25] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[26] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt201LI0EQBuD7/oo5KgiT7sp0YMWDsgYPfkBUPAZx9hBYzR7iSfzvZpKJdkI1zEdVLOS9DZ2k4rTz
//UOVLm+fz18X/10WeZ7NyOJ1MF/535o5nZVFfD5bXo811nj/Py7//lm++OMtOsreDWemnD9OFO1p+mlZX
//h0fZwaZStbqus7s6ilYLdtUtqz0/zl6qdR9VjtcpsT5M1CkS6/X3vmen13+yq5ufd2er9a/7GbKrBbsa
//VyC2ArEVaLfCencnZ+PV9m7t2ecuDKrPbm3c5maiF0f8i3X9cf3bY6qnCvM11/VuH6p66+vV3j7NX8qT
//8enl7fnhr5zD44EHePaIh1Tx0H7xDCI8DniARxkPI6RIt6W2eLaZFGxHUuo8wAM839h5etPh+44SnLjr
//eMABnO/sOqTVdUgHjwMe4LERFvSmw0cFe4ATBwUOcADHUMoWfU4oY6vfLZ2wAQ7gWErYmsChfcJJpWuA
//AziW0rUmcNpla4IdB3AAx2ay1r3fqKBJpWpAAzSWUrU+3YY04DjAARzziVr3WEAdTRwKeKABGkNpGomn
//aaSTpgEO4FhK00g8TSOdNA1wAMdSmkbiaRrppGmAAzh20jQSTtNIJ00DGqCxlKaReJpGOmka4ACOnTSN
//hNM0wW5TXQehQ53aj8vXtwb20Q2JGqE3Gu07a/PAt3m0e+7Yzk8R2O8L/boN82IQOhO9vR7aHe68m9w3
//aToOfuBH2Y9v8SdOEDkUHa/KufE7wxrcwI2mG2oxrAWRf2EjFTepec3BDdyYmtf6nLZJTWsNjg50mNVg
//B3bszGrdj9vwk1o/M6k5DWZgxs6c1v1ANCmYSc1oHmZgxtSMRgozGqnMaLADO3ZmNBKe0UhlRoMZmLEz
//o5HwjNbUzAfXAnaO
