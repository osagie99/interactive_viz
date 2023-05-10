import pandas as pd

data = pd.read_csv("osagie/pycleandata.csv")

# Group data by JobRole and Attrition and count the occurrences
grouped_data = data.groupby(["JobRole", "Attrition"]).size().reset_index(name="Count")

# Pivot the data to have Attrition as columns
pivot_data = grouped_data.pivot_table(index="JobRole", columns="Attrition", values="Count", fill_value=0)

# Calculate the total remain and total leave for each job role
pivot_data["Total Remain"] = pivot_data["No"]
pivot_data["Total Leave"] = pivot_data["Yes"]

# Calculate the percentage of remain and leave for each job role
pivot_data["Percentage Remain"] = (pivot_data["Total Remain"] / (pivot_data["Total Remain"] + pivot_data["Total Leave"])) * 100
pivot_data["Percentage Leave"] = (pivot_data["Total Leave"] / (pivot_data["Total Remain"] + pivot_data["Total Leave"])) * 100

# Reset index and save the result to a new CSV file
pivot_data.reset_index().to_csv("output_with_total_remain_leave_percentage.csv", index=False)