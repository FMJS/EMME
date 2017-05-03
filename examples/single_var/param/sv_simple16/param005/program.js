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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 65536;id7_R_t2: 0";
outputs[5] = "id6_R_t2: 65537;id7_R_t2: 0";
outputs[6] = "id6_R_t2: 65792;id7_R_t2: 0";
outputs[7] = "id6_R_t2: 65793;id7_R_t2: 0";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 1";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 1";
outputs[12] = "id6_R_t2: 65536;id7_R_t2: 1";
outputs[13] = "id6_R_t2: 65537;id7_R_t2: 1";
outputs[14] = "id6_R_t2: 65792;id7_R_t2: 1";
outputs[15] = "id6_R_t2: 65793;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tPwkAUhuG9v6JLTUhK59JGjQuJIW7URBcuiQkuSLwtYGX874KtWPAUi3SmnfDuzJkzUFp88iXD
//iePX2fRtNo3jaDJOR7ejqTqJ+qeTcfb9dxw/v44fn+YNl4PoLHo/nIzV6H40TXrzHfrrr6NetFI1YtWW
//qlrs1WKvEav5tS6q+ZXm1WTe8fwweVnUVam7XNcVdVNRtxX1tOJ9i+v5iM6vL6KrG+5Z/Xu29ulTsVru
//1WKvFnuN2GvEXiv22vXe/BnfDoZfD3nlDn9/uvnO/mJ31WKyaVFtWtTFYrZpZybvLC58WHw5xdeXd+c7
//7+6Lndv8QxzEEjYJ2IAN2DSFze6e/CwuH1DfPTXCu24N0GZolE2hBmqgxkuu2ZKa5YNIfFKjnVGTQQ3U
//QE1T1OwaXNqGRolfIU3SgR/42a+kY1oByJB0oAZq9inpmA4lHVf8pNZqsg4AAVAHTqt+67S8sconQdYh
//NqQdsAEbP6dVW6WddqiR0447gLJjBUAABEBe0k6NY6q2AdLeAdIABEAA1BRAux1edTP/aFIRKIHS3qQi
//0zWWDKkIgABoT1KRCSMV+UWpPMOVABIgAVJoM1y/F0uc/X+Ca61evObfc1015reABmiAJrD5rSaYqT29
//9Tc+tX7TDDRAAzSBTW81C412Bk0GNEADNKHObrnLMz7wIeWAD/gEPLnVLD+GlAM0QMPcVhspxxU+61Nb
//8AM/8BPY1FazAFmH1JB0oAZqgp3Z8pF03PGz+ttk+IEf+AlqYsvdqZUffjT8wA/8hDmv5fssi0QESZDE
//tJZq54SLRAQ/8MOsVofOvZok6RNYvm/U
