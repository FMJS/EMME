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
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = x[0]; report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = x[1]; report.push("id9_R_t3: "+id9_R_t3);
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
outputs[0] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[1] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[9] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[11] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[12] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[13] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[14] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[15] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[17] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[18] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[19] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[20] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[21] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[22] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[23] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[24] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[25] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[26] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[27] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[28] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[29] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[30] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[31] = "id8_R_t3: 33686016;id9_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3UtvI8cVhuF9foWWEWBAbFV3k0yQRYzAyCYJ4Cy8HASYLAaI4yzGK8H/PXPzmDNsdbOKdYP47ISm
//OBS+kd63LqfqPDz89PPb//389uHh7s3rw6vvX70Nf7jb/fHN6+OvXz88/PjT63//5903/PXbuz/dPf3+
//zevHVz+8ejt88+4d4cNX99/cffF0PHkaFp9O779+fP90/vDV10/3J0/nxacff9b3Tz/+pB+fDu++48d/
//vfnv++ePJ593+jw883x85vl08qmnz+dnnu+feX545uf89PP/cvfnv//l7m//kHG5jL/K8PRTf3s6Lz7d
//Lz49LP67p58WFj8tLH5aWPy0sPhpYfHTxsVPGxc/bVz8tHHx08bFT/vtd+mw+PT0e+fF750Xv3e/+L37
//r7/341/M999+9+FP5ovf11//79+9c/f+3c+9OKy9+Lj2Yvj04nHtncfld376wb/79Ke++O8vv/vjO//5
//w/t3/vK7B/AGb/AG7xcL7+v5/NuLn3/dd+XRvfCpgA7oMgZ0o/FcQP/8az3UBHoAdECXMaADeo5BeGuc
//n/6JgTzIyxjkQT7bGvq5AT7/+j7WxPwI6IAuY0AH9ARmr4za2+B8edQO8iAvY5AH+e1R+wXL6a0hH0Ae
//5GUM8iD/VGiJvc9xfCnwT8Mj9EM/9EO/WpovX/wcatXN19P/SkiHdBlDumqaLEP9NkBfHs/DPMzLGOZh
//Pm1l/mxtpjXmR5iHeRnDPMxnW5vvDvLbNTY50T+EYbdHf/RHf/RXNP/Vi5/jq7o7O6M6qssY1VG9QOV8
//G6Yvj+qRHulljPRIX6J8vg3pA9IjvYyRHukr1dD3NKIvSP/pMKI/+qM/+t/gOP9sM7Y1/6fFP0ikR3oZ
//Iz3S5yqg73OcX4r+IUzTOAbrPPiP//ivFdRXL34OKtR0wB7XcV3GuI7r6eheGfS3ofryyB7rsV7GWI/1
//V1x6s7Jb24b1AeuxXsZYj/UJt+Gk1eX0NKrHf/yXMf7jf/b1+pUbFNoYYMR6rJcx1mN9whp+2l05PY31
//8R//ZYz/+J8y1o9pVtLnqj7+47+M8R//n+F/plZVteif2q0qO/uPo3NZ2I/92H+LNT0rJ7PajP6Xz2Bh
//PdbLGOuxPrmmpzvSx5zBxX/8lzH+4//6WD+m8UmfFT34j/8yxn/8j1/n75H+qZ2v8rJ/PkzTDvuxH/ux
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
//Hzkrldk=
