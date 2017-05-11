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
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 514;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 770";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 770";
outputs[15] = "id6_R_t2: 514;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c0lEcWGR4kaFuugyCOkiYK2LdCV9d5PmwjQ90XQyuSz+XThzJpdJ+Ag/
//w/lun3zvE85ZHPnhKkzEHZvfx1FQHnO+3UWbz7ThecEe2M91HIlwHSbeLJ0hj0c3M3ZSVWRVG1VJ9kqy
//V5HV/F6zan6nedVLO7Yf8VdWF0a3WZcNddVQ1w11v+G6xf0c2OPrE3t5w5q1X7Pa0/tk1eyVZK8kexXZ
//q8heTfbqem/+jleL5fEln6xw+XTpzHk2u2nQKwYDalD8NSjLyy+LT4w8Pz07n/m+zmYerjiFgAACQAAI
//uELAO0OgWuZ5/wQQV7WGQXugATSAhh7/D6rl9IakQTqgQYEG0AAaOtFw9mMwFAyCfOHdWTDzBAEUgAJQ
//GCdPkGeD1YKLDmlCrV6c88KMATAABsAwSsbggoXWCYM1Fqe5A7gAF+BilNzBLReyNy4UuAAX4GLcLMIO
//C6skwpoKM58I/FtQASpAxVR2PFQLK90lFNoqoQANoAE0TGYfxOUw2GYU2jKjABgAA2BMZndEFzBkb2Ao
//gAEwAMb09ky04cJFTqHtcooA26tABagYMqcwkkuXKYUiubDMKMACWAALA2YUTlH4L6HoSkUtnwAWwAJY
//DJhP9ISF7AkLBSyABbAYJZvoSMUlyUR7KH4BuCliVA==
