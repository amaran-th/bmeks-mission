"use client";

import PageTitle from "@/components/Typography/PageTitle";
import DatePicker from "./components/DatePicker";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import InputLabel from "@/components/Typography/InputLabel";
import { useFormik } from "formik";
import dayjs from "dayjs";
import TeamSectionSelector from "./components/TeamSectionSelector";
import CustomDataGrid from "./components/CustomDataGrid";
import { useWorkDetailTypes, useWorkTypes } from "@/lib/hooks/useApi";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRecoilValue } from "recoil";
import { currentLanguageState } from "@/store/common";
import { useRef, useState } from "react";
import { Information } from "@/types/dto/common.dto";

export class WorkPermitFilterValues {
  actual_start_date: string;
  actual_end_date: string;
  work_type: Information;
  work_detail_type: Information;
  work_title: string;
  work_team: Information;
  work_div: Information;
  inspection_team: Information;
  inspection_div: Information;
  approval_team: Information;
  approval_section: Information;
  work_order_number: string;
  work_equipment: string;
  work_before: boolean;
  work_in_progress: boolean;
  work_completed: boolean;
  page_number: number;
  page_size: number;

  constructor(
    actual_start_date: string,
    actual_end_date: string,
    work_type: Information,
    work_detail_type: Information,
    work_title: string,
    work_team: Information,
    work_div: Information,
    inspection_team: Information,
    inspection_div: Information,
    approval_team: Information,
    approval_section: Information,
    work_order_number: string,
    work_equipment: string,
    work_before: boolean,
    work_in_progress: boolean,
    work_completed: boolean,
    page_number: number,
    page_size: number
  ) {
    this.actual_start_date = actual_start_date;
    this.actual_end_date = actual_end_date;
    this.work_type = work_type;
    this.work_detail_type = work_detail_type;
    this.work_title = work_title;
    this.work_team = work_team;
    this.work_div = work_div;
    this.inspection_team = inspection_team;
    this.inspection_div = inspection_div;
    this.approval_team = approval_team;
    this.approval_section = approval_section;
    this.work_order_number = work_order_number;
    this.work_equipment = work_equipment;
    this.work_before = work_before;
    this.work_in_progress = work_in_progress;
    this.work_completed = work_completed;
    this.page_number = page_number;
    this.page_size = page_size;
  }
}

export const getStaticProps = async ({ locale }: { locale: "ko" | "en" }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "work-permit"])),
  },
});

export default function Home() {
  const language = useRecoilValue(currentLanguageState);
  const { t } = useTranslation();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [workTypeInputValue, setWorkTypeInputValue] = useState<string>("");
  const [workDetailTypeInputValue, setWorkDetailTypeInputValue] =
    useState<string>("");
  const { current: defaultOption } = useRef<Information>({
    id: 0,
    value: t("전체"),
  });
  const { values, handleChange, setFieldValue } = useFormik({
    onSubmit: () => {},
    initialValues: new WorkPermitFilterValues(
      dayjs(new Date()).format("YYYY-MM-DD"),
      dayjs(new Date()).format("YYYY-MM-DD"),
      defaultOption,
      defaultOption,
      "",
      defaultOption,
      defaultOption,
      defaultOption,
      defaultOption,
      defaultOption,
      defaultOption,
      "",
      "",
      true,
      true,
      true,
      0,
      10
    ),
  });
  const { data: workTypes } = useWorkTypes(language);
  const { data: workDetailTypes } = useWorkDetailTypes(language);

  return (
    <main className="p-[30px] flex flex-col gap-6">
      <PageTitle title={t("work-permit:허가서_조회")} />
      <form
        className="flex flex-col gap-4 border bg-white border-border rounded-md p-6"
        onSubmit={handleChange}
      >
        <Button
          variant="outlined"
          className="sm:hidden"
          onClick={() => setOpenFilter((prev) => !prev)}
        >
          {openFilter ? t("필터_닫기") : t("필터_열기")}
        </Button>
        <div className={`${!openFilter && "hidden"} sm:flex flex-col gap-4`}>
          <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row gap-x-2 gap-y-4 flex-wrap">
            <div className="col-span-2">
              <DatePicker
                startDate={values.actual_start_date}
                endDate={values.actual_end_date}
                startDateName="actual_start_date"
                endDateName="actual_end_date"
                setFieldValue={setFieldValue}
              />
            </div>
            <div>
              <InputLabel label={t("work-permit:작업_종류")} />
              <Autocomplete
                options={workTypes ?? []}
                inputValue={workTypeInputValue}
                value={values.work_type}
                onInputChange={(_, value) => setWorkTypeInputValue(value)}
                onChange={(_, value, reason) => {
                  if (reason === "clear")
                    setFieldValue("work_type", defaultOption);
                  else setFieldValue("work_type", value);
                }}
                getOptionLabel={(option: Information) => option.value}
                className="w-full lg:w-[210px]"
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel label={t("work-permit:작업_상세_분류")} />
              <Autocomplete
                options={workDetailTypes ?? []}
                inputValue={workDetailTypeInputValue}
                value={values.work_detail_type}
                onInputChange={(_, value) => setWorkDetailTypeInputValue(value)}
                onChange={(_, value, reason) => {
                  if (reason === "clear")
                    setFieldValue("work_detail_type", defaultOption);
                  else setFieldValue("work_detail_type", value);
                }}
                getOptionLabel={(option: Information) => option.value}
                className="w-full lg:w-[210px]"
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div>
              <InputLabel label={t("work-permit:작업명")} />
              <TextField
                name="work_title"
                onChange={handleChange}
                className="lg:w-[210px]"
                fullWidth
              />
            </div>
            <TeamSectionSelector
              teamLabel={t("work-permit:작업수행팀")}
              teamName="work_team"
              teamValue={values.work_team}
              sectionLabel={t("work-permit:수행_계")}
              sectionName="work_div"
              sectionValue={values.work_div}
              setFieldValue={setFieldValue}
              allTeam
            />
            <TeamSectionSelector
              teamLabel={t("work-permit:공사감독팀")}
              teamName="inspection_team"
              teamValue={values.inspection_team}
              sectionLabel={t("work-permit:감독_계")}
              sectionName="inspection_div"
              sectionValue={values.inspection_div}
              setFieldValue={setFieldValue}
            />
            <TeamSectionSelector
              teamLabel={t("work-permit:작업승인팀")}
              teamName="approval_team"
              teamValue={values.approval_team}
              sectionLabel={t("work-permit:승인_Section")}
              sectionName="approval_section"
              sectionValue={values.approval_section}
              setFieldValue={setFieldValue}
            />
            <div>
              <InputLabel label={t("work-permit:W/O_Number")} />
              <TextField
                name="work_order_number"
                onChange={handleChange}
                className="w-full lg:w-[210px]"
              />
            </div>

            <div>
              <InputLabel label={t("work-permit:장치명")} />
              <TextField
                name="work_equipment"
                onChange={handleChange}
                className="w-full lg:w-[210px]"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <FormControlLabel
              control={
                <Checkbox
                  name="work_before"
                  checked={values.work_before}
                  value={values.work_before}
                  onChange={handleChange}
                />
              }
              label={t("work-permit:작업_전")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="work_in_progress"
                  checked={values.work_in_progress}
                  value={values.work_in_progress}
                  onChange={handleChange}
                />
              }
              label={t("work-permit:작업_진행_중")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="work_completed"
                  checked={values.work_completed}
                  value={values.work_completed}
                  onChange={handleChange}
                />
              }
              label={t("work-permit:작업_완료/취소")}
            />
          </div>
        </div>
        <CustomDataGrid
          key={JSON.stringify(values)}
          values={values}
          setFieldValue={setFieldValue}
        />
      </form>
    </main>
  );
}
