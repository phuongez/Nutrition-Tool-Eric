import {Form, Input, Select, Image, Flex, InputNumber, Divider, List} from 'antd'
import { useState, useEffect } from 'react';
import MacronutrientPieChart from "../components/MacronutrientPieChart"
import femaleFat from "../assets/femalefat.jpg"
import maleFat from "../assets/malefat.jpg"
import { PiJarLabelDuotone } from "react-icons/pi";


const EricHelmsCal = () => {
    const [form] = Form.useForm(); // Tạo instance của Form
    const [gender, setGender] = useState(null);
    const [weight, setWeight] = useState(null);
    const [activityFactor, setActivityFactor] = useState(null);
    const [bodyfatPercentage, setBodyfatPercentage] = useState(null);
    const [maintainCalories, setMaintainCalories] = useState(null);
    const [phase, setPhase] = useState(null)
    const [gainRate, setGainRate] = useState(null)
    const [lossRate, setLossRate] = useState(null)
    const [refeedTimes, setRefeedTimes] = useState(null)
    const [refeedChoice, setRefeedChoice] = useState(null)
    const [bulkingProteinIntake, setBulkingProteinIntake] = useState(2.0)
    const [cuttingProteinIntake, setCuttingProteinIntake] = useState(2.5)
    const [fatIntake, setFatIntake] = useState(30)
    const [bulkingCalories, setBulkingCalories] = useState(null)
    const [cuttingCalories, setCuttingCalories] = useState(null)
    const [traingGoal, setTrainingGoal] = useState(null)


    useEffect(() => {
        if (weight && activityFactor) {
            const calculatedCalories = weight * 22 * activityFactor;
            setMaintainCalories(Math.round(calculatedCalories / 10) * 10);
            form.setFieldsValue({ 'maintain-calories': calculatedCalories });
        }
    }, [weight, activityFactor, form]);

    useEffect(() => {
        if (phase === "cutting" && lossRate) {
            let calculatedRefeedTimes
            if(gender === 'male') {
                if (bodyfatPercentage >= 20) {
                    calculatedRefeedTimes = 1
                } else if (bodyfatPercentage > 12 && bodyfatPercentage < 20) {
                    calculatedRefeedTimes = 2
                } else {
                    calculatedRefeedTimes = 3
                }
            }
            if(gender === 'female') {
                if (bodyfatPercentage >= 28) {
                    calculatedRefeedTimes = 1
                } else if (bodyfatPercentage > 20 && bodyfatPercentage < 27) {
                    calculatedRefeedTimes = 2
                } else {
                    calculatedRefeedTimes = 3
                }
            }
             
            setRefeedTimes(calculatedRefeedTimes);
            setCuttingCalories((maintainCalories - (weight * 2.2 * 3500 * lossRate) / (7 - refeedChoice)))
        }
    }, [phase, weight, lossRate]);

    useEffect(() => {
        if (phase === "bulking" && gainRate) {
            setBulkingCalories((maintainCalories + (weight * 2.2 * 3500 * gainRate) / (4 * 7)))
        }
    },[phase, weight, gainRate])

    return (
        <div className="calculator-area">
            <div className="input-area">
                <Form form={form} style={{width: "100%"}}>
                    <h1>Level 0: Nhập thông tin </h1>
                    <Form.Item 
                        label="CHỌN GIỚI TÍNH"
                        name="gender"
                        rules={[
                        {
                            required: true,
                            message: 'Chọn giới tính của bạn',
                        },
                        ]}>
                        <Select 
                            onChange={(value) => setGender(value)}
                            placeholder="Chọn giới tính"
                            
                            options={[
                              {
                                value: "male",
                                label: 'Nam giới',
                              },
                              {
                                value: "female",
                                label: 'Nữ giới',
                              },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="CÂN NẶNG (THEO KG)"
                        name="weight"
                        rules={[
                        {
                            required: true,
                            message: 'Nhập cân nặng của bạn',
                        },
                        ]}>
                        <Input
                            inputMode="numeric" 
                            placeholder='Nếu là 55kg thì nhập 55'
                            className='form-inputs'
                            onChange={(e) => setWeight(parseFloat(e.target.value) || null)}
                            suffix="kg"
                        />
                    </Form.Item>
                    <Form.Item 
                        label="MỨC ĐỘ VẬN ĐỘNG"
                        name="activity_factor"
                        rules={[
                        {
                            required: true,
                            message: 'Chọn mức vận động',
                        },
                        ]}>
                        <Select 
                            onChange={(value) => setActivityFactor(value)}
                            placeholder="Chọn mức vận động"
                            options={[
                              {
                                value: 1.45,
                                label: 'Ít vận động + 3-6 buổi tập tạ/tuần',
                              },
                              {
                                value: 1.65,
                                label: 'Vận động nhẹ + 3-6 buổi tập tạ/tuần',
                              },
                              {
                                value: 1.85,
                                label: 'Vận động nhiều + 3-6 buổi tập tạ/tuần',
                              },
                              {
                                value: 2.5,
                                label: 'Vận động rất nhiều + 3-6 buổi tập tạ/tuần',
                              },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="TỶ LỆ % MỠ CƠ THỂ"
                        name="bodyfat-percentage"
                        rules={[
                        {
                            required: true,
                            message: 'Nhập tỷ lệ mỡ của bạn',
                        },
                        // {
                        //     pattern: /^[+]?\d*\.?\d+$/,
                        //     message: 'Vui lòng nhập một số dương hợp lệ',
                        // },
                        {
                            validator: (_, value) => {
                                const numericValue = parseFloat(value?.replace('%', '')); // Loại bỏ dấu %
                                if (!isNaN(numericValue) && numericValue > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Giá trị phải là số dương hợp lệ'));
                            },
                        }
                        ]}>
                        <Input 
                            placeholder='Nếu là 20% thì nhập 20'
                            onChange={(e) => {
                                const value = e.target.value.replace('%', '');
                                setBodyfatPercentage(parseFloat(value) || null);
                            }}
                            suffix="%"
                            inputMode="numeric"
                        />
                    </Form.Item>
                    <Flex gap="small" vertical className="fat-percentage-demo">
                        <p>NỮ GIỚI</p>
                        <Image src={femaleFat} alt="" />
                        <p>NAM GIỚI</p>
                        <Image src={maleFat} alt="" />
                    </Flex>
                    
                    <Form.Item 
                        label="MỨC CALO GIỮ CÂN (HÀNG NGÀY)"
                        name="maintain-calories"
                    >
                        <Input 
                            placeholder='Được tự động tính toán'
                            value={maintainCalories}
                            readOnly
                        />
                    </Form.Item>
                    <h1>Level 1: Cân bằng năng lượng </h1>
                    <Form.Item 
                        label="BẠN ĐANG Ở GIAI ĐOẠN TĂNG CƠ HAY GIẢM MỠ"
                        name="phase"
                        className='row-smallscreen'
                        rules={[
                        {
                            required: true,
                            message: 'Chọn giai đoạn tăng cơ hoặc giảm mỡ',
                        },
                        ]}>
                        <Select 
                            onChange={(value) => setPhase(value)}
                            placeholder="Chọn giai đoạn"
                            options={[
                              {
                                value: "bulking",
                                label: 'Tăng cơ',
                              },
                              {
                                value: "cutting",
                                label: 'Giảm mỡ',
                              },
                            ]}
                        />
                    </Form.Item>
                    {!phase && <p>Chọn giai đoạn ở trên</p>}
                    {phase==="bulking" &&
                        <>
                        <Form.Item 
                            label="Chọn tốc độ tăng cân"
                            name="gain-rate"
                            rules={[
                            {
                                required: true,
                                message: 'Chọn tốc độ tăng cân',
                            },
                            ]}>
                            <Select 
                                onChange={(value) => setGainRate(value)}
                                placeholder="Chọn tốc độ tăng cân"
                                options={[
                                {
                                    value: 0.015,
                                    label: 'Mới tập 1,5% cân nặng/tháng',
                                },
                                {
                                    value: 0.01,
                                    label: 'Trung cấp 1,0% cân nặng/tháng',
                                },
                                {
                                    value: 0.005,
                                    label: 'Cao cấp 0.5% cân nặng/tháng',
                                },
                                ]}
                            />
                        </Form.Item>
                        <Flex justify='space-between'>
                            <p style={{fontWeight: "bold"}}>CALO MỤC TIÊU HÀNG NGÀY CỦA BẠN LÀ:</p>
                            <p>{Math.round((maintainCalories + (weight * 2.2 * 3500 * gainRate) / (4 * 7))/10)*10}</p>
                        </Flex>
                        </>
                    }
                    {phase==="cutting" &&
                    <>
                        <Form.Item 
                            label="Chọn tốc độ giảm cân"
                            name="loss-rate"
                            rules={[
                            {
                                required: true,
                                message: 'Chọn tốc độ giảm cân',
                            },
                            ]}>
                            <Select 
                                onChange={(value) => setLossRate(value)}
                                placeholder="Chọn tốc độ giảm cân"
                                options={[
                                {
                                    value: 0.01,
                                    label: '1.0% cân nặng giảm mỗi tuần',
                                },
                                {
                                    value: 0.007,
                                    label: '0.7% cân nặng giảm mỗi tuần',
                                },
                                {
                                    value: 0.005,
                                    label: '0.5% cân nặng giảm mỗi tuần',
                                },
                                ]}
                            />
                        </Form.Item>
                        <div className="cutting-target">
                            <Flex justify='space-between' wrap>
                                <p style={{marginBottom: "1em"}}>SỐ LẦN REFEEDS: (KHUYẾN CÁO {refeedTimes})</p>
                                <Input 
                                    // onChange={(e) => setRefeedChoice(parseFloat(e.target.value) || null)}
                                    // defaultValue={refeedTimes}
                                    // value={refeedChoice}
                                    onChange={(e) => setRefeedChoice(e.target.value)} 
                                    placeholder='Số lần refeed một tuần'
                                    className="right-aligned-input"
                                    style={{flex: "1 300px"}}
                                    inputMode="numeric"
                                    // pattern="[0-9]*"
                                />
                            </Flex>
                            <Flex justify='space-between' wrap>
                                <p style={{fontWeight: "bold"}}>MỨC CALO NGÀY ĂN ÍT CỦA BẠN LÀ:</p>
                                <p>{Math.round((maintainCalories - (weight * 2.2 * 3500 * lossRate) / (7 - refeedChoice))/10)*10}</p>
                            </Flex>
                            {refeedChoice > 0 &&
                            <Flex justify='space-between'>
                                <p style={{fontWeight: "bold"}}>MỨC CALO NGÀY REFEED CỦA BẠN LÀ:</p>
                                <p>{(Math.round(maintainCalories)/10)*10}</p>
                            </Flex>
                            }
                        </div>
                    </>    
                    }
                    <div className="cardio-part">
                        <h2 className='cardio'>CARDIO</h2>
                        <p>Có thể tập cardio nếu muốn giảm bớt lượng calo phải giới hạn.</p>
                        <Flex justify='space-between' wrap>
                            <p style={{fontWeight: "bold"}}>MỨC CALO THÂM HỤT HÀNG TUẦN TỪ ĂN UỐNG</p>
                            <p>{(Math.round((weight * 2.2 * 3500 * lossRate)/10))*10}</p>
                        </Flex>
                        <p>(Lượng calo đốt được mỗi 10 phút cardio)</p>
                        <div className="cardio-burn">
                        <Flex className='lightgrey-bg' justify='space-between'>
                            <p style={{fontWeight: "bold"}}>CUỜNG ĐỘ THẤP (RPE 2-4/10)</p>
                            <p>{Math.round(weight * 2.2 * 0.2)}</p>
                        </Flex>
                        <Flex justify='space-between'>
                            <p style={{fontWeight: "bold"}}>CUỜNG ĐỘ TRUNG (RPE 5-7/10)</p>
                            <p>{Math.round(weight * 2.2 * 0.45)}</p>
                        </Flex>
                        <Flex className='lightgrey-bg' justify='space-between'>
                            <p style={{fontWeight: "bold"}}>CUỜNG ĐỘ CAO (RPE 8-10/10)</p>
                            <p>{Math.round(weight * 2.2 * 0.7)}</p>
                        </Flex>
                        </div>
                        <p>Các giá trị trên là mức năng lượng đốt ngoài hoạt động thông thường trong 10 phút. 
                            Nếu như bạn tập cardio, tăng lượng fat (9kcal/g) hoặc carb (4kcal/g) để bù lại lượng kcal bị đốt. 
                            Cardio là không cần thiết - trừ khi bạn thích tập nó hơn là phải giới hạn lượng calo. 
                            Nếu tập cardio quá mức sẽ làm xung đột với quá trình phát triển khi tập tạ. 
                            Ở mức tối đa, dành không quá thời gian bằng một nửa thời gian tập tạ cho bài tập cardio.</p>
                    </div>
                    <h1>Level 2: Chất đa lượng (Macro) </h1>
                    <div className="choose-macro">
                        {phase === "bulking" &&
                            <Flex wrap gap="middle" justify='space-between'>
                                <p style={{fontWeight: "bold"}}>PROTEIN</p>
                                <p>Chọn giá trị giữa 1.7 - 2.2 g/kg</p>
                                <InputNumber
                                    className="right-aligned-input" 
                                    placeholder='Mặc định 2.0g/kg trọng lượng cơ thể'
                                    min={1.7}
                                    defaultValue={2.0}
                                    step={0.1}
                                    value={bulkingProteinIntake}
                                    onChange={setBulkingProteinIntake}
                                    style={{flex: "1 300px"}}
                                    suffix="g/kg"
                                    inputMode="decimal"
                                    // pattern="[0-9]*[.,]?[0-9]*"
                                    />
                            </Flex>
                        }
                        {phase === "cutting" &&
                            <Flex wrap gap="middle" justify='space-between'>
                                <p style={{fontWeight: "bold"}}>PROTEIN</p>
                                <p>Chọn giá trị giữa 2.4 - 2.9 g/kg</p>
                                <InputNumber
                                    className="right-aligned-input" 
                                    placeholder='Mặc định 2.5g/kg trọng lượng cơ thể'
                                    min={2.4}
                                    defaultValue={2.5}
                                    step={0.1}
                                    value={cuttingProteinIntake}
                                    onChange={setCuttingProteinIntake}
                                    style={{flex: "1 300px"}}
                                    suffix="g/kg"
                                    inputMode="decimal"
                                    // pattern="[0-9]*[.,]?[0-9]*"
                                    />
                            </Flex>
                        }
                        <Flex wrap gap="middle" justify='space-between'>
                            <p style={{fontWeight: "bold"}}>FAT</p>
                            <p>15-40% tổng lượng calo*</p>
                            <InputNumber
                                className="right-aligned-input" 
                                placeholder='Mặc định 30% calo từ fat'
                                min={15}
                                max={40}
                                defaultValue={30}
                                step={1}
                                value={fatIntake}
                                onChange={setFatIntake}
                                style={{flex: "1 300px"}}
                                suffix="%"
                                inputMode="decimal"
                                // pattern="[0-9]*[.,]?[0-9]*"
                                />
                        </Flex>
                        <p>* 35-40% đối với những phụ nữ có hội chứng buồng chứng đa nang hoặc kinh nguyệt không đều, 
                            những người có tiểu sử gia đình mắc tiểu đường, hoặc những ai đã thử phản ứng của cơ thể với chế độ ăn 
                            nhiều fat/ít carb và thấy rằng nó hiệu quả hơn chế độ ăn ít fat</p>
                    </div>
                    <div className="macro-distribute-part">
                        <h2 className='macro-distribute'>LƯỢNG MACRO MỤC TIÊU, CĂN CỨ VÀO NHU CẦU CỦA BẠN</h2>
                        {phase==="bulking"&&
                        <div>
                            <h2 className='macro-day'>TRONG MỘT NGÀY</h2>
                            <div className="macro-demo">
                                <div className="macro-number">
                                    <Flex className='lightgrey-bg macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>PROTEIN:</p>
                                        <p>{weight*bulkingProteinIntake-20} - {weight*bulkingProteinIntake+20}g</p>
                                    </Flex>
                                    <Flex className='macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>CARB</p>
                                        <p>{Math.round((bulkingCalories-(weight*bulkingProteinIntake*4)-bulkingCalories*fatIntake/100)/4-20)}
                                            - {Math.round((bulkingCalories-(weight*bulkingProteinIntake*4)-bulkingCalories*fatIntake/100)/4+20)}g
                                        </p>
                                    </Flex>
                                    <Flex className='lightgrey-bg macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>FAT:</p>
                                        <p>{Math.round((bulkingCalories*fatIntake)/100/9-20)} 
                                            - {Math.round((bulkingCalories*fatIntake)/100/9+20)}g</p>
                                    </Flex>
                                    <Flex className='macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>XƠ:</p>
                                        <p>{Math.round(bulkingCalories/100)}
                                            - {Math.round(((bulkingCalories-(weight*bulkingProteinIntake*4)-bulkingCalories*fatIntake/100)/4)*0.2)}g
                                        </p>
                                    </Flex>
                                </div>
                                <div className="macro-chart">
                                    <MacronutrientPieChart 
                                        protein={weight*bulkingProteinIntake} 
                                        carbs={(bulkingCalories-(weight*bulkingProteinIntake*4)-bulkingCalories*fatIntake/100)/4} 
                                        fat={(bulkingCalories*fatIntake)/100/9} />
                                </div>
                            </div>
                        </div>
                        }
                        {phase==="cutting"&&
                        <div>
                            <h2 className='macro-day'>NGÀY THÔNG THƯỜNG</h2>
                            <div className="macro-demo">
                                <div className="macro-number">
                                    <Flex className='lightgrey-bg macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>PROTEIN:</p>
                                        <p>{weight*cuttingProteinIntake-20} - {weight*cuttingProteinIntake+20}g</p>
                                    </Flex>
                                    <Flex className='macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>CARB</p>
                                        <p>{Math.round((cuttingCalories-(weight*cuttingProteinIntake*4)-cuttingCalories*fatIntake/100)/4-20)}
                                            - {Math.round((cuttingCalories-(weight*cuttingProteinIntake*4)-cuttingCalories*fatIntake/100)/4+20)}g
                                        </p>
                                    </Flex>
                                    <Flex className='lightgrey-bg macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>FAT:</p>
                                        <p>{Math.round((cuttingCalories*fatIntake)/100/9-20)} 
                                            - {Math.round((cuttingCalories*fatIntake)/100/9+20)}g</p>
                                    </Flex>
                                    <Flex className='macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>XƠ:</p>
                                        <p>{Math.round(cuttingCalories/100)}
                                            - {Math.round(((cuttingCalories-(weight*cuttingProteinIntake*4)-cuttingCalories*fatIntake/100)/4)*0.2)}g
                                        </p>
                                    </Flex>
                                </div>
                                <div className="macro-chart">
                                    <MacronutrientPieChart 
                                        protein={weight*cuttingProteinIntake} 
                                        carbs={(cuttingCalories-(weight*cuttingProteinIntake*4)-cuttingCalories*fatIntake/100)/4} 
                                        fat={(cuttingCalories*fatIntake)/100/9} />
                                </div>
                            </div>
                            {refeedChoice &&
                            <>    
                            <Divider />
                            <h2 className='macro-day'>NGÀY REFEED</h2>
                            <div className="macro-demo">
                                <div className="macro-number">
                                    <Flex className='lightgrey-bg macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>PROTEIN:</p>
                                        <p>{weight*cuttingProteinIntake-20} - {weight*cuttingProteinIntake+20}g</p>
                                    </Flex>
                                    <Flex className='macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>CARB</p>
                                        <p>{Math.round((maintainCalories-(weight*cuttingProteinIntake*4)-maintainCalories*fatIntake/100)/4-20)}
                                            - {Math.round((maintainCalories-(weight*cuttingProteinIntake*4)-maintainCalories*fatIntake/100)/4+20)}g
                                        </p>
                                    </Flex>
                                    <Flex className='lightgrey-bg macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>FAT:</p>
                                        <p>{Math.round((maintainCalories*fatIntake)/100/9-20)} 
                                            - {Math.round((maintainCalories*fatIntake)/100/9+20)}g</p>
                                    </Flex>
                                    <Flex className='macro-cell' justify='space-between'>
                                        <p style={{fontWeight: "bold"}}>XƠ:</p>
                                        <p>{Math.round(maintainCalories/100)}
                                            - {Math.round(((maintainCalories-(weight*cuttingProteinIntake*4)-maintainCalories*fatIntake/100)/4)*0.2)}g
                                        </p>
                                    </Flex>
                                </div>
                                <div className="macro-chart">
                                    <MacronutrientPieChart 
                                        protein={weight*cuttingProteinIntake} 
                                        carbs={(maintainCalories-(weight*cuttingProteinIntake*4)-maintainCalories*fatIntake/100)/4} 
                                        fat={(maintainCalories*fatIntake)/100/9} />
                                </div>
                            </div>
                            </>
                            }
                        </div>
                        }
                    </div>
                    <h1>Level 3: Chất vi lượng (Micro) </h1>
                    <Flex className='micro-cell' justify='space-between'>
                        <p style={{fontWeight: "bold"}}>TRÁI CÂY:</p>
                        <p>{phase==="cutting" ? Math.ceil((maintainCalories+cuttingCalories)/2000) : Math.ceil(bulkingCalories/1000)} phần mỗi ngày</p>
                    </Flex>
                    <Divider />
                    <Flex className='micro-cell' justify='space-between'>
                        <p style={{fontWeight: "bold"}}>RAU XANH:</p>
                        <p>{phase==="cutting" ? Math.ceil((maintainCalories+cuttingCalories)/2000) : Math.ceil(bulkingCalories/1000)} phần mỗi ngày</p>
                    </Flex>                         
                    <h1>Level 4: Thời gian ăn </h1>
                    <Flex className='micro-cell' justify='space-between'>
                        <p style={{fontWeight: "bold"}}>SỐ BỮA ĂN MỘT NGÀY:</p>
                        <p>3-6 bữa mỗi ngày</p>
                    </Flex>
                    <Divider />
                    <Flex className='micro-cell' justify='space-between'>
                        <p style={{fontWeight: "bold"}}>NẠP PROTEIN QUANH THỜI GIAN TẬP:</p>
                        <p>{Math.round(weight*2.2*0.18)} - {Math.round(weight*2.2*0.23)}g</p>
                    </Flex>
                    <p>(1-2 giờ trước và sau khi tập. Nằm trong tổng lượng protein hàng ngày.)</p>
                    <h1>Level 5: Thực phẩm bổ sung</h1>
                    <Form.Item 
                        label="ĐỊNH HƯỚNG LUYỆN TẬP"
                        name="goal"
                        rules={[
                        {
                            required: true,
                            message: 'Chọn hướng luyện tập hiện tại',
                        },
                        ]}>
                        <Select 
                            onChange={(value) => setTrainingGoal(value)}
                            placeholder="Chọn hướng luyện tập"
                            
                            options={[
                              {
                                value: "bodybuilding",
                                label: 'Bodybuilding (Hình thể)',
                              },
                              {
                                value: "powerlifting",
                                label: 'Powerlifting (Sức mạnh)',
                              },
                            ]}
                        />
                    </Form.Item>
                    {phase==="bulking" && traingGoal==="bodybuilding" &&
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Vitamin D3 (trừ trường hợp ra nắng thường xuyên): ${Math.round(weight*2.2*9)} - ${Math.round(weight*2.2*36)} IU/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title="EFA's (EPA & DHA kết hợp): 2-3g/ngày (không cần thiết nếu thường ăn cá +3 bữa/tuần). Nằm trong tổng lượng fat."
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Creatine monohydrate: ${Math.round(weight*2.2*0.02)} g/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Beta alanine: ${Math.round(weight*2.2*0.02)} g/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Caffeine: ${Math.round(weight*2.2*0.5)} - ${Math.round(weight*2.2*1.4)} mg/ngày để giảm mệt mỏi 
                                    HOẶC ${Math.round(weight*2.2*1.8)} - ${Math.round(weight*2.2*2.7)} mg/ngày 30 phút trước khi tập tối đa 2x/tuần để tăng hiệu suất. 
                                    (bắt đầu từ một nửa mức này để xác định phản ứng cá nhân)`}
                                />
                            </List.Item>
                        </List>
                    }                         
                    {phase==="cutting" && traingGoal==="bodybuilding" &&
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title="Vitamin tổng hợp (multivitamin) thông thường 1 lần/ngày"
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Vitamin D3 (trừ trường hợp ra nắng thường xuyên): ${Math.round(weight*2.2*9)} - ${Math.round(weight*2.2*36)} IU/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title="EFA's (EPA & DHA kết hợp): 2-3g/ngày (không cần thiết nếu thường ăn cá +3 bữa/tuần). Nằm trong tổng lượng fat."
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Creatine monohydrate: ${Math.round(weight*2.2*0.02)} g/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Beta alanine: ${Math.round(weight*2.2*0.02)} g/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Caffeine: ${Math.round(weight*2.2*0.5)} - ${Math.round(weight*2.2*1.4)} mg/ngày để giảm mệt mỏi 
                                    HOẶC ${Math.round(weight*2.2*1.8)} - ${Math.round(weight*2.2*2.7)} mg/ngày 30 phút trước khi tập tối đa 2x/tuần để tăng hiệu suất. 
                                    (bắt đầu từ một nửa mức này để xác định phản ứng cá nhân)`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`BCAA ${Math.round(weight*2.2*0.09)}g 30 phút trước tập CHỈ khi không ăn trước tập hoặc ăn ít hơn 2g/kg carbohydrate/ngày, 
                                        HOẶC ${Math.round(weight*2.2*0.23)}g whey protein ~1 tiếng trước khi tập cũng có tác dụng tương đương, 
                                        miễn là khả năng tiêu hoá không gặp vấn đề. Tính trong tổng lượng protein hàng ngày.`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`HMB 3g/ngày chỉ có lợi ích trên lý thuyết, chỉ nên dùng nếu dư dả`}
                                />
                            </List.Item>
                        </List>
                    }                         
                    {phase==="cutting" && traingGoal==="powerlifting" &&
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title="Vitamin tổng hợp (multivitamin) thông thường 1 lần/ngày"
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Vitamin D3 (trừ trường hợp ra nắng thường xuyên): ${Math.round(weight*2.2*9)} - ${Math.round(weight*2.2*36)} IU/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title="EFA's (EPA & DHA kết hợp): 2-3g/ngày (không cần thiết nếu thường ăn cá +3 bữa/tuần). Nằm trong tổng lượng fat."
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Creatine monohydrate: ${Math.round(weight*2.2*0.02)} g/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Caffeine: ${Math.round(weight*2.2*0.5)} - ${Math.round(weight*2.2*1.4)} mg/ngày để giảm mệt mỏi 
                                    HOẶC ${Math.round(weight*2.2*1.8)} - ${Math.round(weight*2.2*2.7)} mg/ngày 30 phút trước khi tập tối đa 2x/tuần để tăng hiệu suất. 
                                    (bắt đầu từ một nửa mức này để xác định phản ứng cá nhân)`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`BCAA ${Math.round(weight*2.2*0.09)}g 30 phút trước tập CHỈ khi không ăn trước tập hoặc ăn ít hơn 2g/kg carbohydrate/ngày, 
                                        HOẶC ${Math.round(weight*2.2*0.23)}g whey protein ~1 tiếng trước khi tập cũng có tác dụng tương đương, 
                                        miễn là khả năng tiêu hoá không gặp vấn đề. Tính trong tổng lượng protein hàng ngày.`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`HMB 3g/ngày chỉ có lợi ích trên lý thuyết, chỉ nên dùng nếu dư dả`}
                                />
                            </List.Item>
                        </List>
                    }                         
                    {phase==="bulking" && traingGoal==="powerlifting" &&
                        <List>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Vitamin D3 (trừ trường hợp ra nắng thường xuyên): ${Math.round(weight*2.2*9)} - ${Math.round(weight*2.2*36)} IU/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title="EFA's (EPA & DHA kết hợp): 2-3g/ngày (không cần thiết nếu thường ăn cá +3 bữa/tuần). Nằm trong tổng lượng fat."
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Creatine monohydrate: ${Math.round(weight*2.2*0.02)} g/ngày`}
                                />
                            </List.Item>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<PiJarLabelDuotone />} 
                                    title={`Caffeine: ${Math.round(weight*2.2*0.5)} - ${Math.round(weight*2.2*1.4)} mg/ngày để giảm mệt mỏi 
                                    HOẶC ${Math.round(weight*2.2*1.8)} - ${Math.round(weight*2.2*2.7)} mg/ngày 30 phút trước khi tập tối đa 2x/tuần để tăng hiệu suất. 
                                    (bắt đầu từ một nửa mức này để xác định phản ứng cá nhân)`}
                                />
                            </List.Item>
                        </List>
                    }                         
                </Form>
                
            </div>
        </div>
    );
}
 
export default EricHelmsCal;