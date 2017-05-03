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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
//eNrt20tPwkAUhuG9v6JLTUhKO0wbNS4khrhRE1y4JCZ1QSLiAlbG/25LCwww3GzPtIF315x2BnrhyRem
//x/fH08n3dOL73jCJBv3BRN147dthEs+3fX80Tj4+0wMeu96d93M5TMLB22AStNIRarZ11fLSaifbDrOq
//nm3l1XzOrJrPmFeD9IjR+/Arq4fGHGZdbal3jNnNut5Sj7Z8bvF9fr375wfv6eUUz21WX56ROfuyqq3V
//yDqDOa+yzqus8yrrvMo67/JaR9aqeay2HqvXj83vcb/bm93klTs3v2rpyHY2etvOYNfOcNdOVeyMd42M
//7SOLL94rHk7r/PbR+cjXt2LkMT+IC9+GQgAKoHB+KJT/3S93Lm58W54Ey6ceDcVuEEIdQQIkkBPKkLC4
//wYFLEpQYCTEkQML5kVA2CNQNgvmwuWCC5AATJIdShiwuiVMozBtBcoAESGhMcqgHBHtykGIi0lqRHYCC
//7HDEv5SbiixOPnRJhRZEgfQACqxOlEgP9ZBgTw9yUMTXIVAABenh2GWJuqFQzqFQQAEU5wdFucWKZuYJ
//RcoAD/BoXMrY+Meybj461keTlAEUQFFfymgcE/vXPOTxMHs0AuAADhKGVI/G5k6Dnf93aKzVizn3920c
//0J8BCIDACohQf0YVHBzcnbEfiYPesQQEQCAhCHVnVAuCEgMhBgRA4A1L6d4MuXzgAglSA0iQGhx0ZlTL
//xJ4XrkkNgAAITe7LcJEapJBY78qACZggNwh1ZVQLhRYkgeQACaxIiPdkuEgOckysvisJEzBBchDpyJBb
//pXDDhIIJmOBNSdl+DNdrFyQM6ICOE+nGkFvRIGHABEycRC+G63WOKun4A5ZeEOg=
