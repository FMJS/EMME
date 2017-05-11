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
      if(id4_R_t2 >= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[6] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqwkAUBuB9nyJLBSE6x4zQ4kJppYteQFtchtJ0EajaRVyVvntzrYnOQC4zmk7+3XBiTsyYj6M/
//2vZuH3ztA9u2fG/sLt2AXVvDG99z0jUL15OsbtubnffxGb74fm5Nre+e7zF37QajQXg2xav+wOplnaJq
//0ue4OslVHWF1FHbbvPnbqM5ynfN1ktTHkj6OpJ5e98eaPd1aj8/m3VlcP9zPWFh1hNV8BxJ2IGEHOu6Q
//7O5yvoi3t7Bn2TsOzxxGZxe27m+LskMT8Xlp/0X66Qm7ixuLeyb9VuuoX7KO9/Z9t/Wmi9nD6q5/ZQMP
//8LQaD+nCQ+fFw4AHeFo0eXKHFM2dtAo4gGPy1GkChwAHcLo6cUj5xCHAARzzJw4pnzgK4URrrigg0P3I
//HK7KhY8vl/TgjeHovrMqD32Vx7vhjh29Cy68Hm8GR3CQK4oIinVeLSR4Wb7K/DD4gZ8z+jn5UqZUT/7z
//gB3YMcsOabVDF7PDYAd2Ljd3Tg6pmTr5KtzAjXEzp7Ebghu46d68IT3zhuAGbkyeN6Rn3uhxI8ulGdzA
//Taty6SZ/IpClAyX+RlAjV4Md2GlTJl1GTrVEGm7gxvw8uowbupAbBjdw08osuv60ESdqMAMzpufQ9ScN
//zMBMNzPo+nOGYAZmOpk/158zOswge4aZ/5E9k4bsmZChwY7x2TMpz57hBm7Mz55JefZM+H0DN4Znz6Q4
//e4YZmDE9eybF2TPMwIzp2TMpzp5hBmZMz55JcfZc1swvbS10IQ==
