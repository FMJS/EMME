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
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[1] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 256";
outputs[5] = "id6_R_t3: 256;id7_R_t3: 256";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 256";
outputs[7] = "id6_R_t3: 65792;id7_R_t3: 256";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3UtvEzEQwPE7n2KPIFXaZl1vBIgDFaq4AFI59BghpYdIlHJIT6jfnbyauK2TdGvP+KH/LXKyTvOY
//X6d4hmnb27v537t52zazaT+5nMzNh+b042w6frjdtje30+vfiwd8PW8+Nf/ezqbd5GoyH50srjCrW+9O
//msXq2fJ2t1y1q1vr1fWey9X1juvV0eIRN79mf5brnbOHu272rJ85u7vrds96v+d5Nz/PffP5+5fm248a
//X9tqffeK3N13q9a72nt3cPc13n2Nd1/j3dd4992917131X2s9T7WPn3s+jO+PL9YfciPPrmHd21x5eny
//6n13jg7d2R2602zuHB96zrH/OTc/+MXmy+nd33/1+sqfV8sr79+0hDlhTphHiuTdndsP/lQ+yD3PSugT
//+oR+pN/wA0N/+wGPNEPfEPqEPqE/PPRDf7GnDnz3yxaTg872gAAI5AIhWmzfElUS3A+C4Cf4Cf4E2UCa
//0PdnA+Eg9NYaSIAE8oEB/2b43Ivti+80UbCEP+FP+AucCgzKCNIEvz8jgARIgASJjOAFBwKpSTCQAAmQ
//EJOEsIOCPHMEOSbG7zuYgAkyh6HHB6mhOPN+NSEBEiBBI3PIDoTj5w0xmaBECSLIGlT6D56fWjosvb77
//4Mn6Zk9Cn9An9PPoSYgR+C/uSIADOICDnPsU4nJg4AAO4KDU3gW53ECeCEqaQYKcQaWfIS4TR4qXAQEQ
//ACHnHgeNrEEKCUqaYIK8QanvIS4UFhIgARJK7oXQyBxgAiZgouj+CLkzCpiACZioomdC++xCgw6KpqGD
//DEOhj0LuRAMmYAImquit0D7nkKeDsirYILtINO/B+YsnWr+FIfQJfUI/7xkQwwP/tf0WcAAHcJD5XIgQ
//DgwcwAEc1DMrIlZuIE8E5dUgQc6QaH5ECBPDSqkBARAAIfOZEvGzBikkKIeCCfKGZHMmQqCwkAAJkFDX
//7In4mQNMwARMVDaPItYZBUzABExUOqNC9uxCgw4KqaGDDCPJ3IpYJxowARMwUeksC9lzDnk6KKuCDbIL
//uX6LAxXZId0W/qJrwp6wJ+zT91pEDfpjnRZQAAVQkGufhRAFBgqgAAoK6rFQyAmkeaCcGiDIFeT6K4SI
//8BdOgwEYgEGuvRWq2YIMEJQ9QQT5gmRfhRASFg7gAA4K66lQzRggAiIgorR+CoWzCIiACIgotZci2RmF
//PBsUSMMGmYVUH4XCyQVEQARElNpDkew8Q5oNt2Sqsz1ogAZ5hd7ECkejaBMrNnsS/AQ/wZ/vzIrhof/a
//mRWAAAiAkP3UihAQDCAAAiDUNLciVn4gj8TjUmqYgAnyBsXJFSFQDPtP6SEBEiAh+9kV8TMHKSaelkMB
//BVCQOyhOrwihwoICKIBCbfMr4mcPQAEUQFHdBItY5xVAARRAUe0MC9lzDA08HhdWgwd4kGWoTbGIdboB
//FEABFNXOsZA985DHg0Ir4CDDSDTJIqQLw1+KTeAT+AR+5rMs4ndggAEYgEGR0yzid1+AARiAQYHzLLQ6
//L0KBoMgaIsgXEk20iN91AQdwAAdFzrTQ6rgIJYJCKJAgZ0g21SJ+twUgAAIgFDrXQqvTAiRAAiQKnWyh
//1WUBEiABEkXOtkjbYREOB2XTwEF2kWS6hVZ3BUiABEgUOd8ibWfFy+H4D0c7XWE=
