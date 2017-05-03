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
      if(id4_R_t2 < id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[8] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[9] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[10] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[11] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 1";
outputs[12] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 2";
outputs[13] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[14] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[15] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 2";
outputs[16] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[17] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 2";
outputs[18] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[19] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[20] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 0";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
outputs[22] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 1";
outputs[23] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 1";
outputs[24] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 2";
outputs[25] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[26] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tLw0AUBeC9vyJLC0LMnHYKiosWLS58QFVcFjEuCmpd1JX43236sGOdQB5zk6ucXZi2N800H/dy
//SON49j5/e5/HcTRNu5PxZG6OosPjadpzjvub4zh+maVPz4s3nw+jk+hjf5qayf1knhwsPo3lUecg2t9U
//ylZXdXZX+85qz7uaLKq9PExfs3XjVHbXkbPezanTy1lfn/czGlydRpfX/+/Kluvb6+l6V3veVbcCvBXg
//rYDdCqvdHQ9Hy+39sWebb7z45GH26R9b53mx739xfYbR+vfz1s8r7a+6qnhzn1VcHS/393H2mp6MBhc3
//Z5292AcoISACahDQ9y6I8HH3uAE8hniIp0E8EMWDZvG4nSchHuJpr/P8eilM33FXhboO4RBOi12nNhy0
//BccQDuG0BwcycCADJy9lSwiHcFSlbE5DCpaxrWuGTtiIh3g0JWxF6JTL12rCMYRDOH8gXSsCB03CyUvW
//CIdw9CRr1fuNPx4I2G2Ihmh0pmrVe404GkM0RKMyUauOBhJo8tI0QzREoypNg0CaBpk0jXiIR1OahuBp
//GmTSNMIhHE1pGoKnaZBJ0wiHcPSkaQicpkEmTSMaotGTpiFwmgaZNI1oiEZPmobAaRrCpWlZp7GBHuqU
//vl22Z7XeW9fm1LC10UhfWZkbvsytXXPHdr6F9Z7P1kvTfvUaG+j/n+7vZMs92Hk7vitix9AO7bRpB1J2
//IGInoR3aadCOKTGs2SB/X4N4z3HntYRu6EbRvFbnnwT+aa3AYwMVZjW6oRtNs1odNxBwk9AN3aif06o/
//DA3hXuPOaIZmaEbRjIbgMxpEZjS6oRtNMxqCz2gQmdHohm70zGgIPKMVNfMFWM92jg==
