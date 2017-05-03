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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = Atomics.load(x, 0); report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = Atomics.load(x, 1); report.push("id9_R_t3: "+id9_R_t3);
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
outputs[1] = "id8_R_t3: 1;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 257;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 65537;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 65793;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 16777216;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 16777217;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 16777472;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 16777473;id9_R_t3: 0";
outputs[12] = "id8_R_t3: 16842752;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 16842753;id9_R_t3: 0";
outputs[14] = "id8_R_t3: 16843008;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 16843009;id9_R_t3: 0";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[17] = "id8_R_t3: 1;id9_R_t3: 1";
outputs[18] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[19] = "id8_R_t3: 257;id9_R_t3: 1";
outputs[20] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[21] = "id8_R_t3: 65537;id9_R_t3: 1";
outputs[22] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[23] = "id8_R_t3: 65793;id9_R_t3: 1";
outputs[24] = "id8_R_t3: 16777216;id9_R_t3: 1";
outputs[25] = "id8_R_t3: 16777217;id9_R_t3: 1";
outputs[26] = "id8_R_t3: 16777472;id9_R_t3: 1";
outputs[27] = "id8_R_t3: 16777473;id9_R_t3: 1";
outputs[28] = "id8_R_t3: 16842752;id9_R_t3: 1";
outputs[29] = "id8_R_t3: 16842753;id9_R_t3: 1";
outputs[30] = "id8_R_t3: 16843008;id9_R_t3: 1";
outputs[31] = "id8_R_t3: 16843009;id9_R_t3: 1";
outputs[32] = "id8_R_t3: 0;id9_R_t3: 256";
outputs[33] = "id8_R_t3: 1;id9_R_t3: 256";
outputs[34] = "id8_R_t3: 256;id9_R_t3: 256";
outputs[35] = "id8_R_t3: 257;id9_R_t3: 256";
outputs[36] = "id8_R_t3: 65536;id9_R_t3: 256";
outputs[37] = "id8_R_t3: 65537;id9_R_t3: 256";
outputs[38] = "id8_R_t3: 65792;id9_R_t3: 256";
outputs[39] = "id8_R_t3: 65793;id9_R_t3: 256";
outputs[40] = "id8_R_t3: 16777216;id9_R_t3: 256";
outputs[41] = "id8_R_t3: 16777217;id9_R_t3: 256";
outputs[42] = "id8_R_t3: 16777472;id9_R_t3: 256";
outputs[43] = "id8_R_t3: 16777473;id9_R_t3: 256";
outputs[44] = "id8_R_t3: 16842752;id9_R_t3: 256";
outputs[45] = "id8_R_t3: 16842753;id9_R_t3: 256";
outputs[46] = "id8_R_t3: 16843008;id9_R_t3: 256";
outputs[47] = "id8_R_t3: 16843009;id9_R_t3: 256";
outputs[48] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[49] = "id8_R_t3: 1;id9_R_t3: 257";
outputs[50] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[51] = "id8_R_t3: 257;id9_R_t3: 257";
outputs[52] = "id8_R_t3: 65536;id9_R_t3: 257";
outputs[53] = "id8_R_t3: 65537;id9_R_t3: 257";
outputs[54] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[55] = "id8_R_t3: 65793;id9_R_t3: 257";
outputs[56] = "id8_R_t3: 16777216;id9_R_t3: 257";
outputs[57] = "id8_R_t3: 16777217;id9_R_t3: 257";
outputs[58] = "id8_R_t3: 16777472;id9_R_t3: 257";
outputs[59] = "id8_R_t3: 16777473;id9_R_t3: 257";
outputs[60] = "id8_R_t3: 16842752;id9_R_t3: 257";
outputs[61] = "id8_R_t3: 16842753;id9_R_t3: 257";
outputs[62] = "id8_R_t3: 16843008;id9_R_t3: 257";
outputs[63] = "id8_R_t3: 16843009;id9_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3U2PG8cRgOF7fsUeI8CASPZ8kAlyiBEYuSQBnIOPQgDlICCOc5BPQf57JEuWabE5s9Oc/tDMc1vM
//LsVFafm+XdXVXS9f/vDj2//8+Pbly6c3r8+vvn31Nvzu6fD7N68vP3/98uX3P7z+57/e/cCfv376w9N/
//f/vm9enVd6/eHr9694rw01cvvnr61dPu6mmIPu3ff316/3T46avPn45XT4fo0w+/6/unH37TD0+P737i
//+3+8+ff756er97t+Hu487+4876/e9fr5cOf5eOf5+c7v+fH3/9/TH//6p6e//E2M88X4sxhev+svT4fo
//0zH69Bz9d6/fLUTfLUTfLUTfLUTfLUTfrYu+Wxd9ty76bl303brou/3yt3SOPr3+2SH6s0P0Z8foz46f
///+yHT8y3X3/z00fmV3+vP//fv3vl4f2r733zOPXN09Q3w8dvXqZeeYm/8uMv/s3Hj3r034+/+sMr//7d
//x1cuwctvXsZQf4R6qId6qN8C6h+n+S/f/PTnfsgP+si7Lsb/NOZP/QD0QA/0QL/5Nf1C0H/6sz6WBH3I
//BvoR6IEe6IF+C6B/dNFeG/PXH7H88B/6Pljnwz/8w//Oa/e3bvj053sqKYAuI+qt9KEe6qF++7X7RSv9
//OqCPr/Tz4X+8nOAf/uEf/je/0n9G0b42/kNx/Af4h3/4h/8t4P+xUn6ba/+yStDhQwiEQAg6fG6++Smo
//Rbd+r/8rdfgAvRgDPdBn7PCpg/n42j8X/NX94R/+4X+vdf+b+k5t/HfF8a/uD//wD//7q/s3B//5np8S
//StDzTwmUQAl6/m+++Sl8RbeDh4yoV/uHeqiHej3/DYA+vv4f1P7hX4zhH/5L9fzXwX8ojn+1f/iHf/jX
//89/o2j/ICChBjCmBEgpkBDe7vrWl0Ec/kDIC+Bdj+If/NTOC5uA/fxIgvxKOwziOp6OGIFZgBVYwwOuz
//b34KVChphjEv7fUEoT3ao/0eZ3hNJAh1WB/PArIaoBttAjAAAzDAHq/+mdgZrmOAUMMA9gEYgAEYYKN3
//AqV1BrWUAZS2wrk7jb28gBVYgRX2uA8wcVtEHS90NQwgL2AABmCAje4NpN0W1FJeUN4K4XA4swIrsAIr
//bDMvWDIgps3dgipWuLACK7ACK3yxVlhpaFgpJ6TODdNXxAhizAiMkLGvaOJ8WZ1MIX6STF8RA4gxAzDA
//yn1FzfF/yfli+wesIMaswAopecGSQTNtdhVVsYL9A1ZgBVbY5P5Bi05InT/m/AEjiDEjMELG8wc3l9DV
//zhSGGgawf8AADMAA+zt/0Bz/56eV2T9gBTFmBVbIdv6gOSuEdqxg/4AVWIEV9nb+oJoTUmeYyRMYQYwZ
//gREeyxOWjLBp8/SBPIEVxJgVWGGtPKFFJ6RONstvhMOVCo5UQAVUQAUGnUWnal6e982rRtdnJgmX2ecf
///80JzJ+nF/4wD/MwD/M7nHC2bD5yNsjHs4Ek9N+B/KkfYB7mYR7md3jd0CTmbzaPC2A+ZMP8CPMwD/Mw
//v807hZYt2OtCfr4DaE30D30frPHBH/zBf+cV+zB/wUQB/HcZQW+VD/RAD/Tbr9kvWuXXwPz8PUHrwn+8
//nMAf/MEf/De/yg8vHpk0U7iOXwb+AfzBH/zBfwvwf6yE3+K6v6wQdPXQAR3Qga6e+aNeBZTQTx/E0tUD
//82IM87p61qr314D8/Hld9X7wF2PwB//H6/1LJsMU7ukpA3/1fvAHf/DfX72/MfSnzgPT408IYkwIhJC5
//x//mBrcCUhgygl7NH+iBHuj1+FfH/Px0LzV/8Bdj8Af/rD3+NeAfisNfzR/8wR/89fg3ue4PsgFCEGNC
//IIQC2cCSmS2Fe/xlA+AvxuAP/nmygcbQnzqpa00hHIdxHE9HTUCcwAmcYDRX0qzGdb0w5mW9PiCsx3qs
//3+N8ronkoAbp4xlAVv53o+I//uM//u/xip+J/eAa/A81+K/+j//4j/8bvfsnrRuondV/aSecu9PYywk4
//gRM4YY/1/4l7IWpYoavBfzkB/uM//m90TyDtVqB2coLyTgiHw5kTOIETOGGbOcGS8S8t7hJUccKFEziB
//Ezjhi3XCSgPByhghdSaYXiI+EGM+4IOMvUQTp8lqZAnxc2N6ifBfjPEf/1fuJWqM/kvOEts34AQx5gRO
//SMkJloyRabGTqIoT7BtwAidwwib3DdozQupsMecN+ECM+YAPMp43uLlqrm6WMNTgv30D/Md//N/feYPG
//6D8/icy+ASeIMSdwQrbzBo05IbTjBPsGnMAJnLC38waVjJA6n0yOwAdizAd88FiOsGRATYunDeQInCDG
//nMAJa+UI7RkhdWpZfh8ciIAIiIAIDDGbnZf5TCFcOeaZKcI80D/+m9dAj38c7i37YR7mYR7mdzi/bNnk
//42yQj2cDSei/A/lTbyQxzMM8zO/xaqFJzN9sGxfAfMiGedOIYR7mYX6jNwgtW7DXhfx898+a6B/6Pljj
//gz/4g//OK/Zh/kqJAvjvMoLeKh/ogR7ot1+zX7TKr4H5+buB1oX/eHHZD/iDP/hvf5UfXjwyU6ZwHb8M
///N30A/7gD/6bgP9jJfwW1/1lhaCrhw7ogA509cwf9CqghH7RQSxdPTAP8zCvqyc5JagB+fnzuur94C/G
//4A/+j9f7l8yCKdzTUwb+6v3gD/7gv796f2PoT50BpsefEMSYEAghc4//zf1tBaQwZAS9mj/QAz3Q6/Gv
//jvn5qV5q/uAvxuAP/ll7/GvAPxSHv5o/+IM/+Ovxb3LdH2QDhCDGhEAIBbKBJRNbCvf4ywbAX4zBH/zz
//ZAONoT91UteaQjgO4ziejpqAOIETOMForpUmNT7ihTEv6/UBYT3WY/0e53NNJAc1SB/PALLyvxsV//Ef
////F/j1f8TOwH1+B/qMF/9X/8x3/83+jdP2ndQO2s/ks74dydxl5OwAmcwAl7rP9P3AtRwwpdDf7LCfAf
////F/o3sCabcCtZMTlHdCOBzOnMAJnMAJ28wJlox/aXGXoIoTLpzACZzACV+sE1YaCFbGCKkzwfQS8YEY
//8wEfZOwlmjhNViNLiJ8b00uE/2KM//i/ci9RY/RfcpbYvgEniDEncEJKTrBkjEyLnURVnGDfgBM4gRM2
//uW/QnhFSZ4s5b8AHYswHfJDxvMHNVXN1s4ShBv/tG+A//uP//s4bNEb/+Ulk9g04QYw5gROynTdozAmh
//HSfYN+AETuCEvZ03qGSE1PlkcgQ+EGM+4IPHcoQlA2paPG0gR+AEMeYETlgrR2jPCKlTy/L74HAlglM/
//UAEVUAEVGGM2Q/3IKy8xlTwzSZhH+niL9PjH4d7CH+iBHuiBfpczzJZNP86G+XhGkAT/O5h/h3agB3qg
//B/pdXjA0CfqbzeMCoA/ZQD8CPdADPdBv9SahZYv2upif7wJaE/5D3wfrfPiHf/jffeU+zF8uUUAAXUbU
//W+lDPdRD/R5q94tW+jVAP39P0Lr4Hy8n+Id/+If/Haz0w4tHJswUrueXwX+Af/iHf/jfBv4fK+W3uPYv
//qwQdPoRACISgwyeikpujXwWk0C86mqXDB+jFGOh1+DyQFtTA/PwZXnV/+Bdj+If/Ner+SybEFO7vKYN/
//dX/4h3/432PdvzH4p84G0/NPCWJMCZSQvef/5ma3AloYMqJe7R/qoR7q9fw3APr5iV9q//AvxvAP/5l7
///mvgPxTHv9o//MM//Ov5b3TtH2QElCDGlEAJRTKCJTNdCvf8ywjgX4zhH/5zZQSNwT91mteaSjgO4zie
//jhqCWIEVWMH4rsR5juuaYcxLez1BaI/2aL/PGV4TCUIN1sezgKwG6EabAAzAAAywz6t/JnaGaxgg1DCA
//fQAGYAAG2OydQGmdQe1kAKWtcO5OYy8vYAVWYIV97gNM3BZRwwtdDQPICxiAARhgs3sDabcFtZMXlLdC
//OBzOrMAKrMAKW80LlgyIaXG3oIoVLqzACqzACl+wFVYaGlbGCalzw/QVMYIYMwIjZO0rmjhfViNTiJ8k
//01fEAGLMAAywel9RY/xfcr7Y/gEriDErsEJaXrBk0EyLXUVVrGD/gBVYgRU2un/QnhNS5485f8AIYswI
//jJD1/MHNJXR1M4WhhgHsHzAAAzDAHs8fNMb/+Wll9g9YQYxZgRUynj9ozAqhHSvYP2AFVmCF/Z0/qOSE
//1Blm8gRGEGNGYIRH84QlI2xaPH0gT2AFMWYFVlgvT2jPCamTzfIb4fArFYxUQAVUQAUGnUWnal7u97I+
//kiRcoq2nkziPfxTuLftBHuRBHuR3Od9s2XTkTIiP5wIJ4L+D+FM/gDzIgzzI7/KqoUnI32wcZ4d8yAT5
//EeRBHuRBfqu3CS1brNdE/Hzvz3rgH/o+WN9DP/RD/+4r9WH+Yons8O+yYd4KH+ZhHub3UKtftMIvD/n5
//24HWRP94OUE/9EM/9O9ghR9ePDJdpmj9vgT6A/RDP/RD/zbQ/1jpvr01f0kd6OQhAzIgA508EY3cHO3K
//LoQ+evBKJw/IizHIg/zqnTzlET9/OledH/rFGPqh//E6/5IpMEX7eEqgX50f+qEf+vdY528K/KmTv/T0
//04EY0wEdZO7pv7mpLbsShmyYV+uHeZiHeT391SE/P8NLrR/6xRj6oT9rT3959IfC6Ffrh37oh349/U2u
//+YNMgA7EmA7ooEAmsGQmS9GefpkA9Isx9EN/nkygKfCnzuFaTwfHYRzH01HjDyMwAiMYu7VkDmMmK4w5
//Sa/3B+mRHun3OXtrIjEoz/n46j8j/btR0R/90R/993mVz8QucHn6h/L0V/dHf/RH/83e8ZPWAdTKyr+s
//Ec7daezlA4zACIywz7r/xA0Q5Z3Qlae/fAD90R/9N7sXkHb7Tyv5QGkjhMPhzAiMwAiMsNV8YMlwl/Z2
//ByoY4cIIjMAIjPAFG2GlYV8lfJA670v/EBuIMRuwQcb+oYmzY+UzhPgpMf1D6C/G6I/+K/cPNcX+JeeG
//7RcwghgzAiOk5ANLhsS01z1UwQj2CxiBERhho/sFrfkgdW6Y8wVsIMZswAYZzxfcXChXM0MYytPffgH6
//oz/67/F8QVPsn58yZr+AEcSYERgh2/mCpowQWjGC/QJGYARG2N/5gio+SJ09Jj9gAzFmAzZ4LD9YMn6m
//vdMF8gNGEGNGYIS18oPWfJA6kSy3DQ40QAM0QAMGlD1jzvHlOTMtl6cHl5lhlBGcxz8K95b8IA/yIA/y
//u5xNtmyicSbExzOBBPDfQfypN2oY5EEe5Pd5hdAk5G82i7NDPmSCvCnDIA/yIL/Zm4KWLdZrIn6+42c9
//8A99H6zvoR/6oX/3lfowf3lEdvh32TBvhQ/zMA/ze6jVL1rhl4f8/B1Aa6J/vLjUB/qhH/r3sMIPLx6Z
//GFO0fl8C/W70gX7oh/6NoP+x0n17a/6SOtDJQwZkQAY6eSIauTnWlV0IfRTnOnlAXoxBHuRX7+Qpj/j5
//s7nq/NAvxtAP/Y/X+ZdMeinax1MC/er80A/90L/HOn9T4E+d76Wnnw7EmA7oIHNP/wT3MylhyIZ5tX6Y
//h3mY19NfHfLzE7vU+qFfjKEf+rP29JdHfyiMfrV+6Id+6NfT3+SaP8gE6ECM6YAOCmQCS+axFO3plwlA
//vxhDP/TnyQSaAn/qFK71dHAcxnE8HTX+MAIjMIKxW0tmMGaywpiT9Hp/kB7pkX6fs7cmEoPynI+v/jPS
//vxsV/dEf/dF/n1f5TOwCl6d/KE9/dX/0R3/03+wdP2kdQK2s/Msa4dydxl4+wAiMwAj7rPtP3ABR3gld
//efrLB9Af/dF/s3sBabf/tJIPlDZCOBzOjMAIjMAIW80Hlgx3aW93oIIRLozACIzACF+wEVYa9lXCB6nz
//vvQPsYEYswEbZOwfmjg7Vj5DiJ8S0z+E/mKM/ui/cv9QU+xfcm7YfgEjiDEjMEJKPrBkSEx73UMVjGC/
//gBEYgRE2ul/Qmg9S54Y5X8AGYswGbJDxfMEN22tmCEN5+tsvQH/0R/89ni9oiv3zU8bsFzCCGDMCI2Q7
//X9CUEUIrRrBfwAiMwAj7O19QxQeps8fkB2wgxmzABo/lB0vGz7R3ukB+wAhizAiMsFZ+0JoPUieSrWeD
///wON3Nyq
